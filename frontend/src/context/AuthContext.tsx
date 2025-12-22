import { createContext } from "react";

interface Card {
  id: string;
  number: string;
  credit: number;
}
interface User {
  id: string;
  email: string;
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
