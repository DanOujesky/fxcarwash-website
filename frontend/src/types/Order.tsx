export interface Order {
  id: string;
  items: OrderItem[];
  price: number;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  email: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  credit: number;
  quantity?: number;
  shipping?: string;
  cardNumber?: string;
  delivery: boolean;
}
