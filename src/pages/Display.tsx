import { useEffect, useState } from 'react';
import { CustomerDisplay } from '@/components/display/CustomerDisplay';
import { Order } from '@/types/order';

const Display = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Listen for order updates from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ORDERS_UPDATE') {
        setOrders(event.data.orders);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Request initial orders from opener
    if (window.opener) {
      window.opener.postMessage({ type: 'REQUEST_ORDERS' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return <CustomerDisplay orders={orders} />;
};

export default Display;
