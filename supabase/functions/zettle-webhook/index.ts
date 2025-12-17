import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-zettle-signature',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function transformZettlePurchase(purchase: any) {
  return {
    id: purchase.purchaseUUID || purchase.purchaseUuid || purchase.uuid,
    orderNumber: purchase.purchaseNumber?.toString() || purchase.receiptNumber || 
                 (purchase.purchaseUUID || purchase.purchaseUuid || purchase.uuid)?.slice(-6).toUpperCase(),
    status: 'pending' as const,
    items: (purchase.products || []).map((product: any) => ({
      name: product.name,
      quantity: product.quantity || 1,
      modifiers: product.variantName ? [{ name: product.variantName }] : [],
      instructions: product.comment || undefined,
    })),
    createdAt: purchase.timestamp || purchase.created || new Date().toISOString(),
    customerName: purchase.customerName || undefined,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Received Zettle webhook:', JSON.stringify(payload, null, 2));

    // Handle different Zettle webhook event types
    const eventType = payload.eventName || payload.event || 'PurchaseCreated';
    
    if (eventType === 'PurchaseCreated' || eventType === 'purchase.created') {
      const purchase = payload.payload || payload;
      const order = transformZettlePurchase(purchase);
      
      console.log('Transformed order:', JSON.stringify(order, null, 2));

      // Broadcast the new order via Supabase Realtime
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const channel = supabase.channel('orders');
      await channel.send({
        type: 'broadcast',
        event: 'new_order',
        payload: order,
      });
      
      console.log('Broadcasted new order via realtime');

      return new Response(JSON.stringify({ success: true, orderId: order.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Acknowledge other event types
    return new Response(JSON.stringify({ success: true, message: 'Event acknowledged' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
