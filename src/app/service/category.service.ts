import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryRequest, GetCategoryResponse } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}
  private ApiUrl = 'http://localhost:8080';

  createCategory(data: CategoryRequest) {
    return this.http.post<CategoryRequest>(`${this.ApiUrl}/categories`, data);
  }

  getAllCategory() {
    return this.http.get<GetCategoryResponse[]>(`${this.ApiUrl}/categories`);
  }

  updateCategory(categoryId: number, payload: CategoryRequest) {
    return this.http.put(`${this.ApiUrl}/categories/${categoryId}`, payload);
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(`${this.ApiUrl}/categories/${categoryId}`);
  }
}
