// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { LenderHistoryComponent } from './lender-history.component';
import { OrderService } from '../../../service/orders.service';
import { ReturnRequestService } from '../../../service/return-request';
import { AuthService } from '../../../service/auth.service';
import { OrderResponse } from '../../../models/orders';
import { LoggedInUser } from '../../../models/logged-in-user';

// We test LenderHistoryComponent because it handles:
// - Fetching lender order history
// - Marking orders as returned
// - Creating return requests

describe('LenderHistoryComponent', () => {
  let component: LenderHistoryComponent;
  let fixture: ComponentFixture<LenderHistoryComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockReturnRequestService: jasmine.SpyObj<ReturnRequestService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockUser = {
    name: 'Test Lender',
    user_id: 'lender-1',
    role: 'lender'
  } as unknown as LoggedInUser;

  const mockOrders: OrderResponse[] = [
    { order: { id: '1' }, product: { name: 'Product 1' } } as unknown as OrderResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockOrderService = jasmine.createSpyObj('OrderService', ['GetLenderOrders', 'MarkOrderAsReturned']);
    mockReturnRequestService = jasmine.createSpyObj('ReturnRequestService', ['CreateReturnRequest']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - component accesses data.data
    mockOrderService.GetLenderOrders.and.returnValue(of({ data: mockOrders } as any));
    mockAuthService.getUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [LenderHistoryComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: ReturnRequestService, useValue: mockReturnRequestService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LenderHistoryComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Safe cleanup - only unsubscribe if subscriptions exist
    if (component.getOrdersSubject) {
      component.getOrdersSubject.unsubscribe();
    }
    if (component.markOrderReturnedSubject) {
      component.markOrderReturnedSubject.unsubscribe();
    }
    if (component.createReturnRequestSubject) {
      component.createReturnRequestSubject.unsubscribe();
    }
  });

  // --- Basic instantiation ---

  it('should create the lender-history component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty AllOrders array', () => {
    // Assert
    expect(component.AllOrders).toEqual([]);
  });

  // --- ngOnInit ---

  it('should get logged in user on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.loggesInUser).toEqual(mockUser);
  }));

  it('should call GetOrders on init', fakeAsync(() => {
    // Arrange
    spyOn(component, 'GetOrders').and.callThrough();

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(component.GetOrders).toHaveBeenCalled();
  }));

  // --- GetOrders ---

  it('should fetch lender orders', fakeAsync(() => {
    // Act
    component.GetOrders();
    tick();

    // Assert
    expect(mockOrderService.GetLenderOrders).toHaveBeenCalled();
    expect(component.AllOrders).toEqual(mockOrders);
  }));

  it('should set isLoading to false after fetching orders', fakeAsync(() => {
    // Act
    component.GetOrders();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
  }));

  it('should show error message when GetOrders fails', fakeAsync(() => {
    // Arrange
    mockOrderService.GetLenderOrders.and.returnValue(throwError(() => ({ error: { details: 'Error fetching orders' } })));

    // Act
    component.GetOrders();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- markOrderAsReturn ---

  it('should call MarkOrderAsReturned service method', fakeAsync(() => {
    // Arrange
    mockOrderService.MarkOrderAsReturned.and.returnValue(of({}));

    // Act
    component.markOrderAsReturn('order-1');
    tick();

    // Assert
    expect(mockOrderService.MarkOrderAsReturned).toHaveBeenCalledWith('order-1');
  }));

  it('should show success message after marking as returned', fakeAsync(() => {
    // Arrange
    mockOrderService.MarkOrderAsReturned.and.returnValue(of({}));

    // Act
    component.markOrderAsReturn('order-1');
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
  }));

  it('should refresh orders after marking as returned', fakeAsync(() => {
    // Arrange
    mockOrderService.MarkOrderAsReturned.and.returnValue(of({}));

    // Act
    component.markOrderAsReturn('order-1');
    tick();

    // Assert
    expect(mockOrderService.GetLenderOrders).toHaveBeenCalled();
  }));

  it('should show error message when markOrderAsReturn fails', fakeAsync(() => {
    // Arrange
    mockOrderService.MarkOrderAsReturned.and.returnValue(throwError(() => new Error('Mark failed')));

    // Act
    component.markOrderAsReturn('order-1');
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- handleCreateReturnRequest ---

  it('should create return request with order id', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.CreateReturnRequest.and.returnValue(of({}));
    const order = { order: { id: 'order-1' } };

    // Act
    component.handleCreateReturnRequest(order);
    tick();

    // Assert
    expect(mockReturnRequestService.CreateReturnRequest).toHaveBeenCalledWith({ order_id: 'order-1' });
  }));

  it('should show success message after creating return request', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.CreateReturnRequest.and.returnValue(of({}));
    const order = { order: { id: 'order-1' } };

    // Act
    component.handleCreateReturnRequest(order);
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
  }));

  it('should refresh orders after creating return request', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.CreateReturnRequest.and.returnValue(of({}));
    const order = { order: { id: 'order-1' } };

    // Act
    component.handleCreateReturnRequest(order);
    tick();

    // Assert
    expect(mockOrderService.GetLenderOrders).toHaveBeenCalled();
  }));

  it('should show error message when creating return request fails', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.CreateReturnRequest.and.returnValue(throwError(() => ({ error: { details: 'Request failed' } })));
    const order = { order: { id: 'order-1' } };

    // Act
    component.handleCreateReturnRequest(order);
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));
});

// END AI-generated - Following QuizApplication testing pattern
