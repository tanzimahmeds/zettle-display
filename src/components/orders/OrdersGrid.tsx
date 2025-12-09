import { Order, OrderStatus } from '@/types/order';
import { OrderCard } from './OrderCard';

interface OrdersGridProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersGrid = ({ orders, onStatusChange }: OrdersGridProps) => {
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
        <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
};
