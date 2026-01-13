import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { Product, ProductResponse } from '../models/product';
import { map } from 'rxjs/internal/operators/map';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  router: Router = inject(Router);
  http: HttpClient = inject(HttpClient);
  private ApiUrl: string = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v6';

  FetchAllProduct(params?: any) {
    return this.http
      .get<{ data: { products: ProductResponse[] } }>(`${this.ApiUrl}/products`, { params })
      .pipe(map(res => res.data));
  }

  CreateProduct(product: Product) {
    return this.http.post(`${this.ApiUrl}/products/create`, product);
  }

  GetProductById(id: string) {
    return this.http
      .get<{ data: ProductResponse }>(`${this.ApiUrl}/product/${id}`)
      .pipe(map(res => res.data));
  }

  UpdateProduct(id: string, product: Product) {
    return this.http.put(`${this.ApiUrl}/products/${id}/update`, product);
  }

  DeleteProduct(id: string) {
    return this.http.delete(`${this.ApiUrl}/products/${id}/delete`);
  }

  getPresignedUrl(fileName: string) {
    return this.http.get<{ uploadUrl: string; fileUrl: string }>(
      `${this.ApiUrl}/images/presigned-url/${fileName}`,
    );
  }

  uploadImageToS3(presignedUrl: string, file: File) {
    console.log('hello from uplaod');
    return this.http.put(presignedUrl, file, {
      headers: new HttpHeaders({ 'Content-Type': file.type }),
    });
  }
}
