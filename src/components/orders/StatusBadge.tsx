import { OrderStatus } from '@/types/order';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/15 text-warning border-warning/30',
  },
  preparing: {
    label: 'Preparing',
    className: 'bg-info/15 text-info border-info/30',
  },
  ready: {
    label: 'Ready',
    className: 'bg-accent/15 text-accent border-accent/30',
  },
  completed: {
    label: 'Completed',
    className: 'bg-muted text-muted-foreground border-border',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'pending' && 'bg-warning',
        status === 'preparing' && 'bg-info animate-pulse',
        status === 'ready' && 'bg-accent',
        status === 'completed' && 'bg-muted-foreground',
        status === 'cancelled' && 'bg-destructive',
      )} />
      {config.label}
    </span>
  );
};
