import { useEffect, useRef, useCallback } from 'react';
import { Order } from '@/types/order';

export const useDisplaySync = (orders: Order[]) => {
  const displayWindowRef = useRef<Window | null>(null);

  // Send orders to display window
  useEffect(() => {
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.postMessage({ type: 'ORDERS_UPDATE', orders }, '*');
    }
  }, [orders]);

  // Listen for order requests from display window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'REQUEST_ORDERS' && displayWindowRef.current) {
        displayWindowRef.current.postMessage({ type: 'ORDERS_UPDATE', orders }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [orders]);

  const openDisplayWindow = useCallback(() => {
    // Close existing window if open
    if (displayWindowRef.current && !displayWindowRef.current.closed) {
      displayWindowRef.current.focus();
      return;
    }

    // Open new display window
    displayWindowRef.current = window.open(
      '/display',
      'CustomerDisplay',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
    );

    // Send initial orders after window loads
    if (displayWindowRef.current) {
      displayWindowRef.current.onload = () => {
        displayWindowRef.current?.postMessage({ type: 'ORDERS_UPDATE', orders }, '*');
      };
    }
  }, [orders]);

  return { openDisplayWindow };
};
