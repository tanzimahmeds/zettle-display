import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersGrid } from '@/components/orders/OrdersGrid';
import { useZettleOrders } from '@/hooks/useZettleOrders';
import { useDisplaySync } from '@/hooks/useDisplaySync';

const Index = () => {
  const { orders, isLoading, fetchOrders, updateOrderStatus } = useZettleOrders();
  const { openDisplayWindow } = useDisplaySync(orders);

  return (
    <div className="min-h-screen bg-background">
      <OrdersHeader
        onRefresh={fetchOrders}
        onOpenDisplay={openDisplayWindow}
        isLoading={isLoading}
        orderCount={orders.length}
      />
      <main className="container mx-auto px-4 py-6">
        <OrdersGrid orders={orders} onStatusChange={updateOrderStatus} />
      </main>
    </div>
  );
};

export default Index;
