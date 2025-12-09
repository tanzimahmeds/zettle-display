import { Order } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true });
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground font-heading">
              {order.orderNumber}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-primary">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          {order.customerName && (
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{order.customerName}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                  {item.quantity}x
                </span>
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
