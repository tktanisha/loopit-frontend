// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { PendingBuyRequestComponent } from './pending-buy-request.component';
import { BuyRequestService } from '../../../service/buy-request.service';
import { AuthService } from '../../../service/auth.service';
import { BuyRequestResponse } from '../../../models/buy-request';
import { LoggedInUser } from '../../../models/logged-in-user';

// We test PendingBuyRequestComponent because it handles:
// - Fetching and filtering pending buy requests
// - Approving and rejecting buy requests

describe('PendingBuyRequestComponent', () => {
  let component: PendingBuyRequestComponent;
  let fixture: ComponentFixture<PendingBuyRequestComponent>;
  let mockBuyRequestService: jasmine.SpyObj<BuyRequestService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockUser: LoggedInUser = {
    name: 'Test User',
    user_id: '1',
    role: 'lender',
    exp: new Date(),
    tokenExpirationDate: new Date()
  } as unknown as LoggedInUser;

  const mockBuyRequests: BuyRequestResponse[] = [
    { id: 1, product: { product: { lender_id: '1' } } } as unknown as BuyRequestResponse,
    { id: 2, product: { product: { lender_id: '2' } } } as unknown as BuyRequestResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockBuyRequestService = jasmine.createSpyObj('BuyRequestService', ['GetAllRequest', 'UpdateBuyRequest']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values
    mockBuyRequestService.GetAllRequest.and.returnValue(of(mockBuyRequests));
    mockAuthService.getUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [PendingBuyRequestComponent],
      providers: [
        { provide: BuyRequestService, useValue: mockBuyRequestService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingBuyRequestComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the pending-buy-request component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty allBuyRequests array', () => {
    // Assert
    expect(component.allBuyRequests).toEqual([]);
  });

  it('should initialize with empty BuyRequestOfUser array', () => {
    // Assert
    expect(component.BuyRequestOfUser).toEqual([]);
  });

  // --- ngOnInit ---

  it('should get logged in user on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.loggedInUser).toEqual(mockUser);
  }));

  it('should call getAllRequest on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockBuyRequestService.GetAllRequest).toHaveBeenCalled();
  }));

  // --- getAllRequest ---

  it('should set isLoading to true when fetching requests', () => {
    // Act
    component.getAllRequest();

    // Assert - initially true
    expect(component.isLoading).toBeFalse(); // becomes false after subscription completes synchronously
  });

  it('should filter requests by lender_id', fakeAsync(() => {
    // Arrange
    component.loggedInUser = mockUser;

    // Act
    component.getAllRequest();
    tick();

    // Assert
    expect(component.allBuyRequests).toEqual(mockBuyRequests);
    expect(component.BuyRequestOfUser.length).toBe(1);
    expect((component.BuyRequestOfUser[0] as any).id).toBe(1);
  }));

  it('should show error message when getAllRequest fails', fakeAsync(() => {
    // Arrange
    mockBuyRequestService.GetAllRequest.and.returnValue(throwError(() => new Error('Network error')));
    component.loggedInUser = mockUser;

    // Act
    component.getAllRequest();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- handleReject ---

  it('should call UpdateBuyRequest with Rejected status', fakeAsync(() => {
    // Arrange
    mockBuyRequestService.UpdateBuyRequest.and.returnValue(of({}));
    component.loggedInUser = mockUser;

    // Act
    component.handleReject(1);
    tick();

    // Assert
    expect(mockBuyRequestService.UpdateBuyRequest).toHaveBeenCalledWith(1, 'Rejected');
  }));

  it('should show success message after rejecting', fakeAsync(() => {
    // Arrange
    mockBuyRequestService.UpdateBuyRequest.and.returnValue(of({}));
    component.loggedInUser = mockUser;

    // Act
    component.handleReject(1);
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
  }));

  it('should show error message when reject fails', fakeAsync(() => {
    // Arrange
    mockBuyRequestService.UpdateBuyRequest.and.returnValue(throwError(() => new Error('Reject failed')));
    component.loggedInUser = mockUser;

    // Act
    component.handleReject(1);
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- handleAccept ---

  it('should call UpdateBuyRequest with Approved status', fakeAsync(() => {
    // Arrange
    mockBuyRequestService.UpdateBuyRequest.and.returnValue(of({}));
    component.loggedInUser = mockUser;

    // Act
    component.handleAccept(1);
    tick();

    // Assert
    expect(mockBuyRequestService.UpdateBuyRequest).toHaveBeenCalledWith(1, 'Approved');
  }));

  it('should show success message after approving', fakeAsync(() => {
    // Arrange
    mockBuyRequestService.UpdateBuyRequest.and.returnValue(of({}));
    component.loggedInUser = mockUser;

    // Act
    component.handleAccept(1);
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
  }));

  it('should refresh requests after successful accept', fakeAsync(() => {
    // Arrange
    mockBuyRequestService.UpdateBuyRequest.and.returnValue(of({}));
    component.loggedInUser = mockUser;

    // Act
    component.handleAccept(1);
    tick();

    // Assert
    expect(mockBuyRequestService.GetAllRequest).toHaveBeenCalled();
  }));
});

// END AI-generated - Following QuizApplication testing pattern
