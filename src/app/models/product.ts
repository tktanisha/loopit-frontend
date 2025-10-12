import { GetCategoryResponse } from './category';
import { User } from './user';

export interface ProductResponse {
  product: Product;
  category: GetCategoryResponse;
  user: User;
}

export interface Product {
  id: number | null;
  lender_id: number | null;
  category_id: number | null;
  name: string;
  description: string;
  duration: number | null;
  is_available: boolean;
  created_at: string | null;
  image_url?: string | null;
}
