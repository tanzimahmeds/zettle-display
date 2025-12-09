export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface ItemModifier {
  name: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifiers?: ItemModifier[];
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  customerName?: string;
  readyAt?: string; // Track when order became ready
}

// Placeholder for Zettle API integration
export interface ZettleApiConfig {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
}

// Zettle API will provide orders in this format
// Transform to Order type when fetching
export const ZETTLE_API_PLACEHOLDER = {
  baseUrl: 'https://purchase.izettle.com',
  endpoints: {
    orders: '/purchases/v2',
    // Add other endpoints as needed
  },
};
