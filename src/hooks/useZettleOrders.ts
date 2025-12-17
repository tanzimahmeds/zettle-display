import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus } from '@/types/order';
import { toast } from 'sonner';

const STATUS_PRIORITY: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  completed: 3,
  cancelled: 4,
};

const COMPLETED_ORDER_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useZettleOrders() {
  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter out completed orders older than 30 minutes and sort by status, then by newest
  const orders = useMemo(() => {
    const now = Date.now();
    
    return rawOrders
      .filter(order => {
        // Keep non-completed orders
        if (order.status !== 'completed') return true;
        
        // For completed orders, check if they're within 30 minutes
        const completedAt = order.readyAt ? new Date(order.readyAt).getTime() : new Date(order.createdAt).getTime();
        return now - completedAt < COMPLETED_ORDER_TIMEOUT_MS;
      })
      .sort((a, b) => {
        // First sort by status priority
        const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
        if (statusDiff !== 0) return statusDiff;
        
        // Then sort by createdAt (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [rawOrders]);

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
      
      setRawOrders(data.orders || []);
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
        setRawOrders(prev => {
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
    setRawOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, readyAt: newStatus === 'ready' || newStatus === 'completed' ? new Date().toISOString() : order.readyAt }
        : order
    ));
    toast.success(`Order status updated to ${newStatus}`);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setRawOrders(prev => [order, ...prev]);
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
