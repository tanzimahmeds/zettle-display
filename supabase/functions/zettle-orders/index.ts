import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ZETTLE_CLIENT_ID = Deno.env.get('ZETTLE_CLIENT_ID');
const ZETTLE_CLIENT_SECRET = Deno.env.get('ZETTLE_CLIENT_SECRET');

interface ZettleToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getAccessToken(): Promise<string> {
  console.log('Fetching Zettle access token...');
  
  const response = await fetch('https://oauth.zettle.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      client_id: ZETTLE_CLIENT_ID!,
      assertion: ZETTLE_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to get access token:', errorText);
    throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
  }

  const data: ZettleToken = await response.json();
  console.log('Successfully obtained access token');
  return data.access_token;
}

async function fetchZettleOrders(accessToken: string) {
  console.log('Fetching orders from Zettle...');
  
  const response = await fetch('https://purchase.izettle.com/purchases/v2', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch orders:', errorText);
    throw new Error(`Failed to fetch orders: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log(`Fetched ${data.purchases?.length || 0} orders`);
  return data.purchases || [];
}

function transformZettleOrder(purchase: any) {
  return {
    id: purchase.purchaseUUID || purchase.purchaseUUID1,
    orderNumber: purchase.purchaseNumber?.toString() || purchase.purchaseUUID?.slice(-6).toUpperCase(),
    status: mapZettleStatus(purchase),
    items: (purchase.products || []).map((product: any) => ({
      name: product.name,
      quantity: product.quantity || 1,
      modifiers: (product.variantName ? [{ name: product.variantName }] : []),
      instructions: product.comment || undefined,
    })),
    createdAt: purchase.timestamp || new Date().toISOString(),
    customerName: purchase.customerName || undefined,
  };
}

function mapZettleStatus(purchase: any): 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' {
  // Zettle doesn't have built-in order status for food orders
  // You may need to use custom fields or a separate system to track status
  // For now, we'll mark recent orders as pending
  const purchaseTime = new Date(purchase.timestamp).getTime();
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  
  if (purchaseTime > hourAgo) {
    return 'pending';
  }
  return 'completed';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ZETTLE_CLIENT_ID || !ZETTLE_CLIENT_SECRET) {
      throw new Error('Zettle API credentials not configured');
    }

    const accessToken = await getAccessToken();
    const purchases = await fetchZettleOrders(accessToken);
    const orders = purchases.map(transformZettleOrder);

    return new Response(JSON.stringify({ orders }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in zettle-orders function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
