import { GetCategoryResponse } from './category';
import { User } from './user';

export interface ProductResponse {
  product: Product;
  category: GetCategoryResponse;
  user: User;
}

export interface Product {
  id: string | null;
  lender_id: string | null;
  category_id: string | null;
  name: string;
  description: string;
  duration: number | null;
  is_available: boolean;
  created_at: string | null;
  image_url?: string | null;
}
