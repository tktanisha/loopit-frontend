import { ProductResponse } from "./product";

export interface Order {
  id: number;
  product_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  total_amount: number;
  security_amount: number;
  status: number;
  created_at: string;
}

export interface OrderResponse {
    order: Order;
    product:ProductResponse
}


export enum OrderStatus {
    InUse='In Use',
	ReturnRequested='Return Requested',
	Returned = 'Returned'

}


export function mapOrderStatus(statusCode: number): OrderStatus | undefined {
  const statusMap: { [key: number]: OrderStatus } = {
    0: OrderStatus.InUse,
    1: OrderStatus.ReturnRequested,
    2: OrderStatus.Returned,
  };

  return statusMap[statusCode];
}