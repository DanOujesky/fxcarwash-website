export interface Order {
  id: string;
  items: OrderItem[];
  count: number;
  createdAt: Date;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}

export interface OrderItem {
  name: string;
  prize: number;
  quantity: number;
  delivery: boolean;
}
