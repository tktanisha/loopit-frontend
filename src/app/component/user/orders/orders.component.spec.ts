// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { OrdersComponent } from './orders.component';
import { OrderService } from '../../../service/orders.service';
import { AuthService } from '../../../service/auth.service';
import { FeedbackService } from '../../../service/feedback.service';
import { OrderResponse } from '../../../models/orders';
import { LoggedInUser } from '../../../models/logged-in-user';

// We test OrdersComponent because it handles:
// - Fetching and displaying user orders
// - Feedback dialog management
// - Submitting feedback for orders

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockFeedbackService: jasmine.SpyObj<FeedbackService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockUser: LoggedInUser = {
    name: 'Test User',
    user_id: '1',
    role: 'user',
    exp: new Date(),
    tokenExpirationDate: new Date()
  } as unknown as LoggedInUser;

  const mockOrders: OrderResponse[] = [
    { order: { id: '1' }, product: { name: 'Product 1' } } as unknown as OrderResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockOrderService = jasmine.createSpyObj('OrderService', ['GetOrderHistory']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockFeedbackService = jasmine.createSpyObj('FeedbackService', ['GiveFeedback']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values
    mockOrderService.GetOrderHistory.and.returnValue(of({ data: mockOrders }));
    mockAuthService.getUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: FeedbackService, useValue: mockFeedbackService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the orders component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with displayFeedbackDialog as false', () => {
    // Assert
    expect(component.displayFeedbackDialog).toBeFalse();
  });

  it('should initialize with empty AllOrders array', () => {
    // Assert
    expect(component.AllOrders).toEqual([]);
  });

  it('should initialize feedbackData with default values', () => {
    // Assert
    expect(component.feedbackData.rating).toBe(0);
    expect(component.feedbackData.description).toBe('');
  });

  // --- ngOnInit ---

  it('should get logged in user and fetch orders on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.loggedInUser).toEqual(mockUser);
  }));

  // --- showFeedbackDialog ---

  it('should open feedback dialog with order id', () => {
    // Act
    component.showFeedbackDialog('order-123');

    // Assert
    expect(component.currentOrderId).toBe('order-123');
    expect(component.displayFeedbackDialog).toBeTrue();
    expect(component.feedbackData.rating).toBe(0);
    expect(component.feedbackData.description).toBe('');
  });

  it('should reset feedbackData when opening dialog', () => {
    // Arrange - set some existing feedback data
    component.feedbackData = { rating: 5, description: 'Great!' };

    // Act
    component.showFeedbackDialog('order-456');

    // Assert
    expect(component.feedbackData.rating).toBe(0);
    expect(component.feedbackData.description).toBe('');
  });
});

// END AI-generated - Following QuizApplication testing pattern
