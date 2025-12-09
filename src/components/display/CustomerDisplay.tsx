import { useEffect, useState } from 'react';
import { Order } from '@/types/order';

interface CustomerDisplayProps {
  orders: Order[];
}

export const CustomerDisplay = ({ orders }: CustomerDisplayProps) => {
  const [visibleReadyOrders, setVisibleReadyOrders] = useState<Order[]>([]);
  
  // Filter pending and preparing orders
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  
  // Handle ready orders with 5-minute timeout
  useEffect(() => {
    const readyOrders = orders.filter(o => o.status === 'ready');
    
    // Add new ready orders
    readyOrders.forEach(order => {
      if (!visibleReadyOrders.find(o => o.id === order.id)) {
        setVisibleReadyOrders(prev => [...prev, order]);
        
        // Remove after 5 minutes
        setTimeout(() => {
          setVisibleReadyOrders(prev => prev.filter(o => o.id !== order.id));
        }, 5 * 60 * 1000);
      }
    });
  }, [orders]);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center text-foreground mb-8 font-heading">
        Order Status
      </h1>
      
      <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Pending/Preparing Orders */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            In Progress
          </h2>
          <div className="space-y-3">
            {activeOrders.map(order => (
              <div
                key={order.id}
                className="bg-secondary rounded-lg p-6 text-center"
              >
                <span className="text-3xl font-bold text-secondary-foreground font-heading">
                  {order.orderNumber}
                </span>
                <div className="text-sm text-muted-foreground mt-1 capitalize">
                  {order.status}
                </div>
              </div>
            ))}
            {activeOrders.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No orders in progress
              </div>
            )}
          </div>
        </div>
        
        {/* Ready Orders */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Ready for Pickup
          </h2>
          <div className="space-y-3">
            {visibleReadyOrders.map(order => (
              <div
                key={order.id}
                className="bg-green-500 rounded-lg p-6 text-center animate-pulse"
              >
                <span className="text-3xl font-bold text-white font-heading">
                  {order.orderNumber}
                </span>
              </div>
            ))}
            {visibleReadyOrders.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No orders ready
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
