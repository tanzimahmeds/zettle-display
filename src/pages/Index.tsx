import { useState, useCallback } from 'react';
import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersGrid } from '@/components/orders/OrdersGrid';
import { mockOrders } from '@/data/mockOrders';
import { Order, OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setOrders([...mockOrders]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: 'Order updated',
      description: `Order status changed to ${newStatus}`,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <OrdersHeader
        onRefresh={handleRefresh}
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
