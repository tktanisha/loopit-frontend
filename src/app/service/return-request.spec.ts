// BEGIN AI-generated - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReturnRequestService } from './return-request';
import { ReturnRequestPayload, ReturnRequestResponse } from '../models/return-request';

// We test ReturnRequestService because it handles:
// - Creating return requests (lender side)
// - Getting all return requests (user side)
// - Updating return request status (user side)

describe('ReturnRequestService', () => {
  let service: ReturnRequestService;
  let httpMock: HttpTestingController;

  const ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  const mockReturnRequestPayload: ReturnRequestPayload = {
    order_id: 'order-1'
  };

  const mockReturnRequestResponse: ReturnRequestResponse = {
    id: '1',
    order_id: 'order-1',
    requested_by: 1,
    status: 0,
    created_at: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReturnRequestService]
    });

    service = TestBed.inject(ReturnRequestService);
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

  // --- CreateReturnRequest ---

  it('should create return request with POST request', () => {
    // Act
    service.CreateReturnRequest(mockReturnRequestPayload).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/return-requests`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockReturnRequestPayload);
    req.flush({ success: true });
  });

  // --- GetAllReturnRequests ---

  it('should get all return requests with GET request', () => {
    // Arrange
    const mockResponse = [mockReturnRequestResponse];

    // Act
    service.GetAllReturnRequests().subscribe(data => {
      // Assert
      expect(data).toEqual([mockReturnRequestResponse]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/return-requests`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle empty return request list', () => {
    // Act
    service.GetAllReturnRequests().subscribe(data => {
      // Assert
      expect(data).toEqual([]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/return-requests`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // --- UpdateReturnRequestStatus ---

  it('should update return request status with PATCH request', () => {
    // Arrange
    const requestId = '123';
    const status = 'approved';

    // Act
    service.UpdateReturnRequestStatus(requestId, status).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/return-requests/${requestId}/update`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'approved' });
    req.flush({ success: true });
  });
});

// END AI-generated - Following QuizApplication testing pattern
