import { GetCategoryResponse } from "./category";
import { User } from "./user";

export interface ProductResponse {
	product:GetProduct  
	category:GetCategoryResponse
	user:User   
}

export interface GetProduct{
  id: number;
  lender_id: number;
  category_id: number;
  name: string;
  description: string;
  duration: number; 
  is_available: boolean;
  created_at: string | null;

}