import { Order, OrderStatus } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, User, ChefHat, Check, X, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const statusActions: Record<OrderStatus, { next: OrderStatus; label: string; icon: React.ReactNode }[]> = {
  pending: [
    { next: 'preparing', label: 'Start', icon: <ChefHat className="w-3.5 h-3.5" /> },
    { next: 'cancelled', label: 'Cancel', icon: <X className="w-3.5 h-3.5" /> },
  ],
  preparing: [
    { next: 'ready', label: 'Ready', icon: <Bell className="w-3.5 h-3.5" /> },
    { next: 'cancelled', label: 'Cancel', icon: <X className="w-3.5 h-3.5" /> },
  ],
  ready: [
    { next: 'completed', label: 'Complete', icon: <Check className="w-3.5 h-3.5" /> },
  ],
  completed: [],
  cancelled: [],
};

export const OrderCard = ({ order, onStatusChange }: OrderCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true });
  const actions = statusActions[order.status];
  
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
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                  {item.quantity}x
                </span>
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
              
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="ml-8 mt-1 flex flex-wrap gap-1">
                  {item.modifiers.map((mod, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded"
                    >
                      {mod.name}
                    </span>
                  ))}
                </div>
              )}
              
              {item.instructions && (
                <div className="ml-8 mt-1">
                  <span className="text-xs text-warning font-medium">
                    📝 {item.instructions}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {actions.length > 0 && (
          <div className="flex gap-2 pt-2 border-t border-border/30">
            {actions.map((action) => (
              <Button
                key={action.next}
                size="sm"
                variant={action.next === 'cancelled' ? 'outline' : 'default'}
                className={action.next === 'cancelled' ? 'text-destructive hover:text-destructive' : ''}
                onClick={() => onStatusChange(order.id, action.next)}
              >
                {action.icon}
                <span className="ml-1.5">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
