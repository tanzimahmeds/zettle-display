import { useState, useCallback, useEffect } from 'react';
import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersGrid } from '@/components/orders/OrdersGrid';
import { getPlaceholderOrders } from '@/data/placeholderOrders';
import { Order, OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { useDisplaySync } from '@/hooks/useDisplaySync';

const Index = () => {
  const [orders, setOrders] = useState<Order[]>(getPlaceholderOrders());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { openDisplayWindow } = useDisplaySync(orders);

  // Simulate new orders coming in (replace with Zettle API polling/webhook)
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Replace with actual Zettle API fetch
      // const newOrders = await fetchZettleOrders(config);
      // setOrders(prev => mergeOrders(prev, newOrders));
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // TODO: Replace with actual Zettle API fetch
    setTimeout(() => {
      setOrders(getPlaceholderOrders());
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              readyAt: newStatus === 'ready' ? new Date().toISOString() : order.readyAt
            } 
          : order
      )
    );
    toast({
      title: 'Order updated',
      description: `Order status changed to ${newStatus}`,
    });
  }, [toast]);

  // Function to add new order (call this when Zettle sends new order)
  const addNewOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    toast({
      title: 'New order',
      description: `Order ${order.orderNumber} received`,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <OrdersHeader
        onRefresh={handleRefresh}
        onOpenDisplay={openDisplayWindow}
        isLoading={isLoading}
        orderCount={orders.length}
      />
      <main className="container mx-auto px-4 py-6">
        <OrdersGrid orders={orders} onStatusChange={handleStatusChange} />
      </main>
    </div>
  );
};

export default Index;
