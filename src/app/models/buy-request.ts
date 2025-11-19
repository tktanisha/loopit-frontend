import {  ProductResponse } from "./product"

export interface BuyRequestPayload{
    product_id:string
}

export interface BuyRequestResponse{
    buy_request:BuyRequest
    product:ProductResponse
}

export interface BuyRequest{
    id:string
    product_id:string
    requested_by:string
    status:number
    created_at:string
}

export enum BuyStatus{
    Pending='Pending',
    Approved='Approved',
    Rejected='Rejected'

}


export function mapBuyStatus(statusCode: number): BuyStatus | undefined {
  const statusMap: { [key: number]: BuyStatus } = {
    0: BuyStatus.Pending,
    1: BuyStatus.Approved,
    2: BuyStatus.Rejected,
  };

  return statusMap[statusCode];
}