import {  ProductResponse } from "./product"

export interface ReturnRequestPayload{
    order_id:number
}

export interface ReturnRequestResponse{
    id:number
    order_id:number
    requested_by:number
    status:number
    created_at:string
}

export interface ReturnRequest{
    id:number
    order_id:number
    requested_by:number
    status:number
    created_at:string
}

export enum ReturnStatus{
    Pending='Pending',
    Approved='Approved',
    Rejected='Rejected'

}


export function mapReturnStatus(statusCode: number): ReturnStatus | undefined {
  const statusMap: { [key: number]: ReturnStatus } = {
    0: ReturnStatus.Pending,
    1: ReturnStatus.Approved,
    2: ReturnStatus.Rejected,
  };

  return statusMap[statusCode];
}