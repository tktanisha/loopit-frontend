import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BuyRequestPayload } from '../models/buy-request';
import { BuyRequestResponse } from '../models/buy-request';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class BuyRequestService {
  http: HttpClient = inject(HttpClient);
  private ApiUrl: string = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  createRequest(request: BuyRequestPayload) {
    return this.http.post<any>(`${this.ApiUrl}/buyer-requests`, request);
  }

  GetAllRequest(status?: string) {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http
      .get<{ data: BuyRequestResponse[] }>(`${this.ApiUrl}/buyer-requests`, { params })
      .pipe(
        map(response => response.data),
      );
  }

  UpdateBuyRequest(requestID: number, status: string) {
    const payload = { status: status };
    return this.http.patch<any>(`${this.ApiUrl}/buyer-requests/${requestID}/update`, payload);
  }
}
