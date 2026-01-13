import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ReturnRequestPayload, ReturnRequestResponse } from '../models/return-request';

@Injectable({
  providedIn: 'root',
})
export class ReturnRequestService {
  http = inject(HttpClient);
  private ApiUrl: string = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  CreateReturnRequest(payload: ReturnRequestPayload) {
    //lender
    return this.http.post(`${this.ApiUrl}/return-requests`, payload);
  }

  GetAllReturnRequests() {
    //user
    return this.http.get<ReturnRequestResponse[]>(`${this.ApiUrl}/return-requests`);
  }

  UpdateReturnRequestStatus(requestId: string, status: string) {
    //user
    const payload = { status: status };
    return this.http.patch(`${this.ApiUrl}/return-requests/${requestId}/update`, payload);
  }
}
