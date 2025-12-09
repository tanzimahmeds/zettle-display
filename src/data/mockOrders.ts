import { Order } from '@/types/order';

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1042',
    status: 'pending',
    customerName: 'Table 5',
    items: [
      { id: '1a', name: 'Margherita Pizza', quantity: 2, unitPrice: 14.99 },
      { id: '1b', name: 'Caesar Salad', quantity: 1, unitPrice: 9.99 },
      { id: '1c', name: 'Sparkling Water', quantity: 2, unitPrice: 3.50 },
    ],
    total: 46.97,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    orderNumber: '#1041',
    status: 'preparing',
    customerName: 'Table 3',
    items: [
      { id: '2a', name: 'Grilled Salmon', quantity: 1, unitPrice: 24.99 },
      { id: '2b', name: 'Garlic Bread', quantity: 1, unitPrice: 5.99 },
    ],
    total: 30.98,
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '3',
    orderNumber: '#1040',
    status: 'ready',
    customerName: 'Table 8',
    items: [
      { id: '3a', name: 'Beef Burger', quantity: 3, unitPrice: 16.99 },
      { id: '3b', name: 'French Fries', quantity: 2, unitPrice: 4.99 },
      { id: '3c', name: 'Craft Beer', quantity: 3, unitPrice: 7.50 },
    ],
    total: 83.45,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: '4',
    orderNumber: '#1039',
    status: 'completed',
    customerName: 'Table 2',
    items: [
      { id: '4a', name: 'Pasta Carbonara', quantity: 2, unitPrice: 17.99 },
      { id: '4b', name: 'Tiramisu', quantity: 2, unitPrice: 8.99 },
    ],
    total: 53.96,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '5',
    orderNumber: '#1038',
    status: 'cancelled',
    customerName: 'Table 1',
    items: [
      { id: '5a', name: 'Veggie Wrap', quantity: 1, unitPrice: 12.99 },
    ],
    total: 12.99,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];
