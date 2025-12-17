import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import { toast } from 'sonner';

export function useZettleOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fnError } = await supabase.functions.invoke('zettle-orders');
      
      if (fnError) {
        throw new Error(fnError.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setOrders(data.orders || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      toast.error('Failed to fetch orders', { description: message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to realtime order updates
  useEffect(() => {
    fetchOrders();

    // Listen for new orders via realtime broadcast
    const channel = supabase
      .channel('orders')
      .on('broadcast', { event: 'new_order' }, ({ payload }) => {
        console.log('Received new order via realtime:', payload);
        setOrders(prev => {
          // Avoid duplicates
          if (prev.some(o => o.id === payload.id)) {
            return prev;
          }
          toast.success('New order received!', { 
            description: `Order ${payload.orderNumber}` 
          });
          return [payload as Order, ...prev];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, readyAt: newStatus === 'ready' ? new Date().toISOString() : order.readyAt }
        : order
    ));
    toast.success(`Order status updated to ${newStatus}`);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    updateOrderStatus,
    addOrder,
  };
}
