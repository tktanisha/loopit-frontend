export interface CategoryRequest {
  name: string;
  price: number | null;
  security: number | null;
}

export interface GetCategoryResponse {
  id: string;
  name: string;
  price: number;
  security: number;
}
