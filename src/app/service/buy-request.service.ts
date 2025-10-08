import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BuyRequestPayload } from "../models/buy-request";
import { BuyRequestResponse } from "../models/buy-request";


@Injectable({
    providedIn:'root'
})
export class BuyRequestService {
    http:HttpClient=inject(HttpClient)
    private ApiUrl:string="http://localhost:8080"
    


    createRequest(request:BuyRequestPayload){
       return this.http.post<any>(`${this.ApiUrl}/buyer-requests`,request)
    }

    GetAllRequest(status?:string){
       let params = new HttpParams()
        if(status){
         params= params.set('status',status)
        }
        return this.http.get<BuyRequestResponse[]>(`${this.ApiUrl}/buyer-requests`,{params})
    }

    UpdateBuyRequest(requestID:number,status:string) {
        const payload = { status: status }
       return this.http.patch<any>(`${this.ApiUrl}/buyer-requests/${requestID}/update`,payload)
    }
}