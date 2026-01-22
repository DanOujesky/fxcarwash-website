export interface Order {
  id: string;
  items: OrderItem[];
  createdAt: Date;
  price: number;
  phone?: string;
  email: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  prize: number;
  credit: number;
  quantity?: number;
  shipping?: string;
  cardNumber?: string;
  delivery: boolean;
}
