import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ReturnRequestPayload, ReturnRequestResponse } from '../models/return-request';

@Injectable({
  providedIn: 'root',
})
export class ReturnRequestService {
  http = inject(HttpClient);
  private ApiUrl: string = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v1';

  CreateReturnRequest(payload: ReturnRequestPayload) {
    //lender
    return this.http.post(`${this.ApiUrl}/return-requests`, payload);
  }

  GetAllReturnRequests() {
    //user
    return this.http.get<ReturnRequestResponse[]>(`${this.ApiUrl}/return-requests`);
  }

  UpdateReturnRequestStatus(requestId: number, status: string) {
    //user
    const payload = { status: status };
    return this.http.patch(`${this.ApiUrl}/return-requests/${requestId}/update`, payload);
  }
}
