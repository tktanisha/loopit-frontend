// BEGIN AI-generated - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './orders.service';
import { OrderResponse } from '../models/orders';

// We test OrderService because it handles:
// - Getting order history
// - Marking orders as returned
// - Getting approved awaiting orders
// - Getting lender orders

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  const mockOrderResponse: OrderResponse = {
    order: { id: '1', product_id: 'prod-1', user_id: 'user-1', status: 'completed' } as any,
    product: {} as any
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });

    service = TestBed.inject(OrderService);
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

  // --- GetOrderHistory ---

  it('should get order history with GET request', () => {
    // Arrange
    const mockResponse = {
      data: [mockOrderResponse]
    };

    // Act
    service.GetOrderHistory().subscribe(res => {
      // Assert
      expect(res.data).toEqual([mockOrderResponse]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/orders/history`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- MarkOrderAsReturned ---

  it('should mark order as returned with PATCH request', () => {
    // Arrange
    const orderId = '123';

    // Act
    service.MarkOrderAsReturned(orderId).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/orders/${orderId}/return`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush({ success: true });
  });

  // --- GetAllApprovedAwaitingOrders ---

  it('should get all approved awaiting orders with GET request', () => {
    // Arrange
    const mockResponse = {
      data: [mockOrderResponse]
    };

    // Act
    service.GetAllApprovedAwaitingOrders().subscribe(data => {
      // Assert
      expect(data).toEqual([mockOrderResponse]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/orders/approved-awaiting`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- GetLenderOrders ---

  it('should get lender orders with GET request', () => {
    // Arrange
    const mockResponse = {
      orders: [mockOrderResponse]
    };

    // Act
    service.GetLenderOrders().subscribe(res => {
      // Assert
      expect(res.orders).toEqual([mockOrderResponse]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/orders/lender`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

// END AI-generated - Following QuizApplication testing pattern
