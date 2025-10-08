import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {  OrderResponse } from "../models/orders";



@Injectable({
    providedIn:'root'
})
export class OrderService {

    http:HttpClient = inject(HttpClient)
    private ApiUrl= "http://localhost:8080"

    GetOrderHistory(){
        return this.http.get<OrderResponse[]>(`${this.ApiUrl}/orders/history`)
    }

    MarkOrderAsReturned(orderId:number){
        return this.http.patch<any>(`${this.ApiUrl}/orders/${orderId}/return`,{})
    }

    GetAllApprovedAwaitingOrders(){
        return this.http.get<OrderResponse[]>(`${this.ApiUrl}/orders/approved-awaiting`)
    }

    GetLenderOrders() {
        return this.http.get<OrderResponse[]>(`${this.ApiUrl}/orders/lender`)
    }
}