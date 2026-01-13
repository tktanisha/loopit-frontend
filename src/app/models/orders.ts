import { ProductResponse } from './product';

export interface Order {
  id: string;
  product_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  security_amount: number;
  status: string;
  created_at: string;
}

export interface OrderResponse {
  order: Order;
  product: ProductResponse;
}
