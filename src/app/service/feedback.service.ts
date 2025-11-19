import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feedback, FeedbackRequest } from '../models/feedback';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  http = inject(HttpClient);
  private ApiUrl: string = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v3';

  GiveFeedback(request: FeedbackRequest) {
    return this.http.post<any>(`${this.ApiUrl}/feedbacks`, request);
  }

  GetAllRecievedFeedback() {
    return this.http
      .get<{ data: Feedback[] }>(`${this.ApiUrl}/feedbacks/recieved`)
      .pipe(map(res => res.data));
  }
}
