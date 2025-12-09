import { Order } from '@/types/order';

// Placeholder orders for development
// Replace with actual Zettle API integration
export const getPlaceholderOrders = (): Order[] => [
  {
    id: '1',
    orderNumber: '#1042',
    status: 'pending',
    customerName: 'Table 5',
    items: [
      { 
        id: '1a', 
        name: 'Margherita Pizza', 
        quantity: 2,
        modifiers: [{ name: 'Extra cheese' }, { name: 'Thin crust' }],
        instructions: 'Well done'
      },
      { 
        id: '1b', 
        name: 'Caesar Salad', 
        quantity: 1,
        modifiers: [{ name: 'No croutons' }]
      },
    ],
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    orderNumber: '#1041',
    status: 'preparing',
    customerName: 'Table 3',
    items: [
      { 
        id: '2a', 
        name: 'Grilled Salmon', 
        quantity: 1,
        modifiers: [{ name: 'Medium rare' }],
        instructions: 'Allergy: No nuts'
      },
      { 
        id: '2b', 
        name: 'Garlic Bread', 
        quantity: 1 
      },
    ],
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '3',
    orderNumber: '#1040',
    status: 'ready',
    customerName: 'Table 8',
    items: [
      { 
        id: '3a', 
        name: 'Beef Burger', 
        quantity: 3,
        modifiers: [{ name: 'No onions' }, { name: 'Extra bacon' }]
      },
      { 
        id: '3b', 
        name: 'French Fries', 
        quantity: 2,
        modifiers: [{ name: 'Seasoned' }]
      },
    ],
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    readyAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
];

// TODO: Replace with actual Zettle API integration
// Example fetch function structure:
// export const fetchZettleOrders = async (config: ZettleApiConfig): Promise<Order[]> => {
//   const response = await fetch(`${ZETTLE_API_PLACEHOLDER.baseUrl}${ZETTLE_API_PLACEHOLDER.endpoints.orders}`, {
//     headers: { Authorization: `Bearer ${config.accessToken}` }
//   });
//   const data = await response.json();
//   return transformZettleOrders(data);
// };
