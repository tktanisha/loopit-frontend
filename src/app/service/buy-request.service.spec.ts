// BEGIN AI-generated - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuyRequestService } from './buy-request.service';
import { BuyRequestPayload, BuyRequestResponse } from '../models/buy-request';

// We test BuyRequestService because it handles:
// - Creating buy requests
// - Getting all requests with optional status filter
// - Updating buy request status

describe('BuyRequestService', () => {
  let service: BuyRequestService;
  let httpMock: HttpTestingController;

  const ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  const mockBuyRequest: BuyRequestPayload = {
    product_id: 'prod-1'
  };

  const mockBuyRequestResponse: BuyRequestResponse = {
    buy_request: { id: '1', product_id: 'prod-1', requested_by: 'user-1', status: 'pending', created_at: '' },
    product: {} as any
  } as unknown as BuyRequestResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyRequestService]
    });

    service = TestBed.inject(BuyRequestService);
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

  // --- createRequest ---

  it('should create a buy request with POST request', () => {
    // Act
    service.createRequest(mockBuyRequest).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/buyer-requests`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBuyRequest);
    req.flush({ success: true });
  });

  // --- GetAllRequest ---

  it('should get all requests without status filter', () => {
    // Arrange
    const mockResponse = {
      data: [mockBuyRequestResponse]
    };

    // Act
    service.GetAllRequest().subscribe(data => {
      // Assert
      expect(data).toEqual([mockBuyRequestResponse]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/buyer-requests`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all requests with status filter', () => {
    // Arrange
    const mockResponse = {
      data: [mockBuyRequestResponse]
    };
    const status = 'pending';

    // Act
    service.GetAllRequest(status).subscribe(data => {
      // Assert
      expect(data).toEqual([mockBuyRequestResponse]);
    });

    // Assert - verify HTTP request with status param
    const req = httpMock.expectOne(`${ApiUrl}/buyer-requests?status=pending`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- UpdateBuyRequest ---

  it('should update buy request status with PATCH request', () => {
    // Arrange
    const requestId = 123;
    const status = 'approved';

    // Act
    service.UpdateBuyRequest(requestId, status).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/buyer-requests/${requestId}/update`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'approved' });
    req.flush({ success: true });
  });
});

// END AI-generated - Following QuizApplication testing pattern
