// Signup Component Tests - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { SignupComponent } from './signup.component';
import { AuthService } from '../../service/auth.service';
import { SocietyService } from '../../service/society.service';

// We test SignupComponent because it handles:
// - User registration form submission
// - Society selection dropdown
// - Navigation after successful signup
// - Error handling for failed signup attempts

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSocietyService: jasmine.SpyObj<SocietyService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockSocieties = [
    { id: '1', name: 'Society A' },
    { id: '2', name: 'Society B' }
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockAuthService = jasmine.createSpyObj('AuthService', ['signup', 'handleAuthSuccess']);
    mockSocietyService = jasmine.createSpyObj('SocietyService', ['fetchAllSociety']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - fetchAllSociety returns data that component accesses via data.societies
    mockSocietyService.fetchAllSociety.and.returnValue(of({ societies: mockSocieties } as any));

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SocietyService, useValue: mockSocietyService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Clean up subscriptions
    if (component.signUpSubject) {
      component.signUpSubject.unsubscribe();
    }
    if (component.societySubject) {
      component.societySubject.unsubscribe();
    }
  });

  // --- Basic instantiation ---

  it('should create the signup component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty user data', () => {
    // Assert - initial state
    expect(component.user.fullname).toBe('');
    expect(component.user.email).toBe('');
    expect(component.user.password).toBe('');
    expect(component.user.phoneNumber).toBe('');
    expect(component.user.address).toBe('');
    expect(component.user.societyId).toBeNull();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  // --- ngOnInit ---

  it('should fetch all societies on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockSocietyService.fetchAllSociety).toHaveBeenCalled();
    expect(component.allSociety).toEqual(mockSocieties as any);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when fetching societies fails', fakeAsync(() => {
    // Arrange
    mockSocietyService.fetchAllSociety.and.returnValue(throwError(() => new Error('Network error')));

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
  }));

  // --- onSocietyChange ---

  it('should update societyId when a society is selected', () => {
    // Arrange
    const mockEvent = {
      target: { value: '123' }
    } as unknown as Event;

    // Act
    component.onSocietyChange(mockEvent);

    // Assert
    expect(component.user.societyId).toBe('123');
  });

  // --- handleOnClose ---

  it('should emit closeEvent when handleOnClose is called', () => {
    // Arrange
    spyOn(component.closeEvent, 'emit');

    // Act
    component.handleOnClose();

    // Assert
    expect(component.closeEvent.emit).toHaveBeenCalled();
  });

  // --- Output events ---

  it('should have closeEvent output event', () => {
    // Assert - verify output is defined
    expect(component.closeEvent).toBeDefined();
  });

  // --- ngOnDestroy ---

  it('should implement OnDestroy', () => {
    // Assert - verify component has ngOnDestroy
    expect(component.ngOnDestroy).toBeDefined();
  });
});
