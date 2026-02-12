// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ApprovedAwaitingOrdersComponent } from './approved-awaiting-orders.component';
import { OrderService } from '../../../service/orders.service';
import { OrderResponse } from '../../../models/orders';

// We test ApprovedAwaitingOrdersComponent because it handles:
// - Fetching approved awaiting orders
// - Marking orders as returned

describe('ApprovedAwaitingOrdersComponent', () => {
  let component: ApprovedAwaitingOrdersComponent;
  let fixture: ComponentFixture<ApprovedAwaitingOrdersComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockOrders: OrderResponse[] = [
    { order: { id: '1' }, product: { name: 'Product 1' } } as unknown as OrderResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockOrderService = jasmine.createSpyObj('OrderService', ['GetAllApprovedAwaitingOrders', 'MarkOrderAsReturned']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - component expects data.orders
    mockOrderService.GetAllApprovedAwaitingOrders.and.returnValue(of({ orders: mockOrders } as any));

    await TestBed.configureTestingModule({
      imports: [ApprovedAwaitingOrdersComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovedAwaitingOrdersComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Safe cleanup - only unsubscribe if subscriptions exist
    if (component.approvedAwaitingorderSubject) {
      component.approvedAwaitingorderSubject.unsubscribe();
    }
    if (component.markOrderReturnedSubject) {
      component.markOrderReturnedSubject.unsubscribe();
    }
  });

  // --- Basic instantiation ---

  it('should create the approved-awaiting-orders component', () => {
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

  it('should call getAllApprovedAwaitingOrders on init', fakeAsync(() => {
    // Arrange
    spyOn(component, 'getAllApprovedAwaitingOrders').and.callThrough();

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(component.getAllApprovedAwaitingOrders).toHaveBeenCalled();
  }));

  // --- getAllApprovedAwaitingOrders ---

  it('should fetch approved awaiting orders', fakeAsync(() => {
    // Act
    component.getAllApprovedAwaitingOrders();
    tick();

    // Assert
    expect(mockOrderService.GetAllApprovedAwaitingOrders).toHaveBeenCalled();
    expect(component.AllOrders).toEqual(mockOrders);
  }));

  it('should set isLoading to false after fetching orders', fakeAsync(() => {
    // Act
    component.getAllApprovedAwaitingOrders();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
  }));

  it('should set AllOrders to empty array when no data', fakeAsync(() => {
    // Arrange
    mockOrderService.GetAllApprovedAwaitingOrders.and.returnValue(of({} as any));

    // Act
    component.getAllApprovedAwaitingOrders();
    tick();

    // Assert
    expect(component.AllOrders).toEqual([]);
  }));

  it('should show error message when fetch fails', fakeAsync(() => {
    // Arrange
    mockOrderService.GetAllApprovedAwaitingOrders.and.returnValue(throwError(() => new Error('Network error')));

    // Act
    component.getAllApprovedAwaitingOrders();
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
    mockOrderService.MarkOrderAsReturned.and.returnValue(of({ orders: mockOrders }));

    // Act
    component.markOrderAsReturn('order-1');
    tick();

    // Assert
    expect(mockOrderService.MarkOrderAsReturned).toHaveBeenCalledWith('order-1');
  }));

  it('should show success message after marking as returned', fakeAsync(() => {
    // Arrange
    mockOrderService.MarkOrderAsReturned.and.returnValue(of({ orders: mockOrders }));

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
    mockOrderService.MarkOrderAsReturned.and.returnValue(of({ orders: mockOrders }));

    // Act
    component.markOrderAsReturn('order-1');
    tick();

    // Assert
    expect(mockOrderService.GetAllApprovedAwaitingOrders).toHaveBeenCalled();
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
});

// END AI-generated - Following QuizApplication testing pattern
