import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { Product, ProductResponse } from '../models/product';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  router: Router = inject(Router);
  http: HttpClient = inject(HttpClient);
  private ApiUrl: string = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v3';

  FetchAllProduct(params?: any) {
    return this.http
      .get<{ data: ProductResponse[] }>(`${this.ApiUrl}/products`, { params })
      .pipe(map(res => res.data));
  }

  CreateProduct(product: Product) {
    return this.http.post(`${this.ApiUrl}/products/create`, product);
  }

  GetProductById(id: number) {
    return this.http
      .get<{ data: ProductResponse }>(`${this.ApiUrl}/product/${id}`)
      .pipe(map(res => res.data));
  }

  UpdateProduct(id: number, product: Product) {
    return this.http.put(`${this.ApiUrl}/products/${id}/update`, product);
  }

  DeleteProduct(id: number) {
    return this.http.delete(`${this.ApiUrl}/products/${id}/delete`);
  }
}
