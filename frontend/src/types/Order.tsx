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
  companyName?: string;
  companyICO?: string;
  companyDIC?: string;
  companyAddress?: string;
  companyZipCode?: string;
  companyCity?: string;
}

export interface OrderItem {
  id: string;
  temp_id: string;
  name: string;
  price: number;
  credit: number;
  quantity?: number;
  shipping?: string;
  cardNumber?: string;
  delivery: boolean;
}
