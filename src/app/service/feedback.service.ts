import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feedback, FeedbackRequest } from '../models/feedback';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  http = inject(HttpClient);
  private ApiUrl: string = 'http://localhost:8080';

  GiveFeedback(request: FeedbackRequest) {
    return this.http.post<any>(`${this.ApiUrl}/feedbacks`, request);
  }

  GetAllRecievedFeedback() {
    return this.http.get<Feedback[]>(`${this.ApiUrl}/feedbacks/recieved`);
  }
}
