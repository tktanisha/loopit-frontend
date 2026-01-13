import { ProductResponse } from './product';

export interface BuyRequestPayload {
  product_id: string;
}

export interface BuyRequestResponse {
  buy_request: BuyRequest;
  product: ProductResponse;
}

export interface BuyRequest {
  id: string;
  product_id: string;
  requested_by: string;
  status: string;
  created_at: string;
}
