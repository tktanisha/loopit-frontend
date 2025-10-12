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


  FetchAllProduct(params?: any) {
    return this.http.get<ProductResponse[]>(`${this.ApiUrl}/products`, { params });
  }

  CreateProduct(product:Product){
    return this.http.post(`${this.ApiUrl}/products/create`,product)
  }

  GetProductById(id:number){
    return this.http.get<ProductResponse>(`${this.ApiUrl}/product/${id}`)
  }

  UpdateProduct(id:number,product:Product){
    return this.http.put(`${this.ApiUrl}/products/${id}/update`,product)
  }
  
  DeleteProduct(id:number){
    return this.http.delete(`${this.ApiUrl}/products/${id}/delete`)
  }
  
}