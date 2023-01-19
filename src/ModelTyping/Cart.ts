import { Product } from "./Product";

export interface Cart {
  qty: number;
  product: Product;
}

export interface Carts {
  id?: number;
  user_id?: number;
  total_formatted?: string;
  total?: number;
  discount?: number;
  discount_formatted?: string;
}
