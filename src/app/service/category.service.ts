import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CategoryRequest } from "../models/category";


@Injectable({
   providedIn:'root' 
})
export class CategoryComponent {
  
    constructor(private router:Router , private http:HttpClient){} 

    private ApiUrl='http://localhost:8080'

    createCategory(data:CategoryRequest) {

        this.http.post<CategoryRequest>(`${this.ApiUrl}/categories`,data)

    }
}