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
  private ApiUrl = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v3';

  createCategory(data: CategoryRequest) {
    return this.http
      .post<{ data: CategoryRequest }>(`${this.ApiUrl}/categories`, data)
      .pipe(map(res => res.data));
  }

  getAllCategory() {
    return this.http
      .get<{ data: GetCategoryResponse[] }>(`${this.ApiUrl}/categories`)
      .pipe(map(res => res.data));
  }

  updateCategory(categoryId: number, payload: CategoryRequest) {
    return this.http.put(`${this.ApiUrl}/categories/${categoryId}`, payload);
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(`${this.ApiUrl}/categories/${categoryId}`);
  }
}
