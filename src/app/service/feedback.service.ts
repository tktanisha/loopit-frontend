import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feedback, FeedbackRequest } from '../models/feedback';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  http = inject(HttpClient);
  private ApiUrl: string = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  GiveFeedback(request: FeedbackRequest) {
    return this.http.post<any>(`${this.ApiUrl}/feedbacks`, request);
  }

  GetAllRecievedFeedback() {
    return this.http
      .get<{ data: Feedback[] }>(`${this.ApiUrl}/feedbacks/recieved`)
      .pipe(map(res => res.data));
  }
}
