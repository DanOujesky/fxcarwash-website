export interface Order {
  id: string;
  items: OrderItem[];
  createdAt: Date;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  prize: number;
  quantity?: number;
  shipping?: string;
  cardNumber?: string;
  delivery: boolean;
}
