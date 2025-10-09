export interface CategoryRequest {
  name: string;
  price: number | null;
  security: number | null;
}

export interface GetCategoryResponse {
  id: number;
  name: string;
  price: number;
  security: number;
}
