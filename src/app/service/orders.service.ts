import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderResponse } from '../models/orders';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http: HttpClient = inject(HttpClient);
  private ApiUrl = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v3';

  GetOrderHistory() {
    return this.http.get<{ data: OrderResponse[] }>(`${this.ApiUrl}/orders/history`);
  }

  MarkOrderAsReturned(orderId: number) {
    return this.http.patch<any>(`${this.ApiUrl}/orders/${orderId}/return`, {});
  }

  GetAllApprovedAwaitingOrders() {
    return this.http
      .get<{ data: OrderResponse[] }>(`${this.ApiUrl}/orders/approved-awaiting`)
      .pipe(map(res => res.data));
  }

  GetLenderOrders() {
    return this.http
      .get<{ data: OrderResponse[] }>(`${this.ApiUrl}/orders/lender`)
      .pipe(map(res => res.data));
  }
}
