import { Order } from '@/types/order';
import { OrderCard } from './OrderCard';

interface OrdersGridProps {
  orders: Order[];
}

export const OrdersGrid = ({ orders }: OrdersGridProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No orders found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
