// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ReturnRequestComponent } from './return-request.component';
import { ReturnRequestService } from '../../../service/return-request';
import { ReturnRequestResponse } from '../../../models/return-request';

// We test ReturnRequestComponent because it handles:
// - Fetching all return requests
// - Approving and rejecting return requests

describe('ReturnRequestComponent', () => {
  let component: ReturnRequestComponent;
  let fixture: ComponentFixture<ReturnRequestComponent>;
  let mockReturnRequestService: jasmine.SpyObj<ReturnRequestService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockReturnRequests: ReturnRequestResponse[] = [
    { id: '1', status: 'pending' } as unknown as ReturnRequestResponse,
    { id: '2', status: 'approved' } as unknown as ReturnRequestResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockReturnRequestService = jasmine.createSpyObj('ReturnRequestService', ['GetAllReturnRequests', 'UpdateReturnRequestStatus']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - component expects res.data
    mockReturnRequestService.GetAllReturnRequests.and.returnValue(of({ data: mockReturnRequests } as any));

    await TestBed.configureTestingModule({
      imports: [ReturnRequestComponent],
      providers: [
        { provide: ReturnRequestService, useValue: mockReturnRequestService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnRequestComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the return-request component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty allReturnRequests array', () => {
    // Assert
    expect(component.allReturnRequests).toEqual([]);
  });

  // --- ngOnInit ---

  it('should call getAllRequest on init', fakeAsync(() => {
    // Arrange
    spyOn(component, 'getAllRequest').and.callThrough();

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(component.getAllRequest).toHaveBeenCalled();
  }));

  // --- getAllRequest ---

  it('should fetch all return requests', fakeAsync(() => {
    // Act
    component.getAllRequest();
    tick();

    // Assert
    expect(mockReturnRequestService.GetAllReturnRequests).toHaveBeenCalled();
    expect(component.allReturnRequests).toEqual(mockReturnRequests);
  }));

  it('should set isLoading to false after fetching requests', fakeAsync(() => {
    // Act
    component.getAllRequest();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
  }));

  it('should show error message when getAllRequest fails', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.GetAllReturnRequests.and.returnValue(throwError(() => new Error('Network error')));

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

  it('should call UpdateReturnRequestStatus with Rejected status', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.UpdateReturnRequestStatus.and.returnValue(of({}));

    // Act
    component.handleReject('req-1');
    tick();

    // Assert
    expect(mockReturnRequestService.UpdateReturnRequestStatus).toHaveBeenCalledWith('req-1', 'Rejected');
  }));

  it('should refresh requests after rejecting', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.UpdateReturnRequestStatus.and.returnValue(of({}));

    // Act
    component.handleReject('req-1');
    tick();

    // Assert
    expect(mockReturnRequestService.GetAllReturnRequests).toHaveBeenCalled();
  }));

  it('should show error message when reject fails', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.UpdateReturnRequestStatus.and.returnValue(throwError(() => new Error('Reject failed')));

    // Act
    component.handleReject('req-1');
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- handleAccept ---

  it('should call UpdateReturnRequestStatus with Approved status', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.UpdateReturnRequestStatus.and.returnValue(of({}));

    // Act
    component.handleAccept('req-1');
    tick();

    // Assert
    expect(mockReturnRequestService.UpdateReturnRequestStatus).toHaveBeenCalledWith('req-1', 'Approved');
  }));

  it('should show success message after accepting', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.UpdateReturnRequestStatus.and.returnValue(of({}));

    // Act
    component.handleAccept('req-1');
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
  }));

  it('should refresh requests after successful accept', fakeAsync(() => {
    // Arrange
    mockReturnRequestService.UpdateReturnRequestStatus.and.returnValue(of({}));

    // Act
    component.handleAccept('req-1');
    tick();

    // Assert
    expect(mockReturnRequestService.GetAllReturnRequests).toHaveBeenCalled();
  }));
});

// END AI-generated - Following QuizApplication testing pattern
