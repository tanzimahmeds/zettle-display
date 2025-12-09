import { Button } from '@/components/ui/button';
import { RefreshCw, UtensilsCrossed } from 'lucide-react';

interface OrdersHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  orderCount: number;
}

export const OrdersHeader = ({ onRefresh, isLoading, orderCount }: OrdersHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Food Orders</h1>
              <p className="text-sm text-muted-foreground">
                {orderCount} orders via Zettle
              </p>
            </div>
          </div>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
};
