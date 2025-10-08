import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { inject, Injectable } from "@angular/core"
import { Product, ProductResponse } from "../models/product"


@Injectable({
    providedIn:'root'
})
export class ProductService{
    
 router:Router=inject(Router)
 http:HttpClient=inject(HttpClient)
 private ApiUrl:string="http://localhost:8080"


  FetchAllProduct(){
    return this.http.get<ProductResponse[]>(`${this.ApiUrl}/products`)
  }

  CreateProduct(product:Product){
    return this.http.post(`${this.ApiUrl}/products/create`,product)
  }

  GetProductById(id:number){
    return this.http.get<ProductResponse>(`${this.ApiUrl}/product/${id}`)
  }
}