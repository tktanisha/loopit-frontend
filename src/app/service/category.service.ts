import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryRequest, GetCategoryResponse } from '../models/category';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}
  private ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  createCategory(data: CategoryRequest) {
    return this.http
      .post<{ data: CategoryRequest }>(`${this.ApiUrl}/categories`, data)
      .pipe(map(res => res.data));
  }

  getAllCategory() {
    return this.http
      .get<{ status: boolean; data: GetCategoryResponse[] }>(`${this.ApiUrl}/categories`)
      .pipe(
        map(res => {
          console.log('categories==', res.data);
          return res.data; 
        })
      );
}

  updateCategory(categoryId: string, payload: CategoryRequest) {
    return this.http.put(`${this.ApiUrl}/categories/${categoryId}`, payload);
  }

  deleteCategory(categoryId: string) {
    return this.http.delete(`${this.ApiUrl}/categories/${categoryId}`);
  }
}
