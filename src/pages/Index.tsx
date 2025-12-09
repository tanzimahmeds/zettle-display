import { useState, useCallback } from 'react';
import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersGrid } from '@/components/orders/OrdersGrid';
import { mockOrders } from '@/data/mockOrders';
import { Order } from '@/types/order';

const Index = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // Simulate API call - replace with real Zettle API integration
    setTimeout(() => {
      setOrders([...mockOrders]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <OrdersHeader
        onRefresh={handleRefresh}
        isLoading={isLoading}
        orderCount={orders.length}
      />
      <main className="container mx-auto px-4 py-6">
        <OrdersGrid orders={orders} />
      </main>
    </div>
  );
};

export default Index;
