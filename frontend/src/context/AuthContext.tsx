import { createContext } from "react";

interface Card {
  id: string;
  number: string;
  name: string;
  credit: number;
}
interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  discount: number;
  cards: Card[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
export type { User, AuthContextType };
