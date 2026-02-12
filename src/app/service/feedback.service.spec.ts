// BEGIN AI-generated - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FeedbackService } from './feedback.service';
import { Feedback, FeedbackRequest } from '../models/feedback';

// We test FeedbackService because it handles:
// - Submitting feedback
// - Getting all received feedback

describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpMock: HttpTestingController;

  const ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  const mockFeedbackRequest: FeedbackRequest = {
    order_id: 'order-1',
    feedback_text: 'Great product!',
    rating: 5
  };

  const mockFeedback: Feedback = {
    id: '1',
    given_by: 'user-1',
    given_to: 'lender-1',
    text: 'Great product!',
    rating: 5,
    created_at: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeedbackService]
    });

    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- Basic instantiation ---

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  // --- GiveFeedback ---

  it('should submit feedback with POST request', () => {
    // Act
    service.GiveFeedback(mockFeedbackRequest).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/feedbacks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFeedbackRequest);
    req.flush({ success: true });
  });

  // --- GetAllRecievedFeedback ---

  it('should get all received feedback with GET request', () => {
    // Arrange
    const mockResponse = {
      data: [mockFeedback]
    };

    // Act
    service.GetAllRecievedFeedback().subscribe(data => {
      // Assert
      expect(data).toEqual([mockFeedback]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/feedbacks/recieved`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle empty feedback list', () => {
    // Arrange
    const mockResponse = {
      data: []
    };

    // Act
    service.GetAllRecievedFeedback().subscribe(data => {
      // Assert
      expect(data).toEqual([]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/feedbacks/recieved`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

// END AI-generated - Following QuizApplication testing pattern
