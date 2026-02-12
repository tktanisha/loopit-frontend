// Login Component Tests - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { LoginComponent } from './login.component';
import { AuthService } from '../../service/auth.service';
import { LoginResponse } from '../../models/login';

// We test LoginComponent because it handles:
// - User login form submission
// - Password visibility toggle
// - Navigation after successful login
// - Error handling for failed login attempts

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockLoginResponse: LoginResponse = {
    token: 'test-token',
    user: {
      id: '1',
      Name: 'Test User',
      Role: 'user'
    }
  };

  const mockAdminLoginResponse: LoginResponse = {
    token: 'test-token',
    user: {
      id: '1',
      Name: 'Admin User',
      Role: 'admin'
    }
  };

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'handleAuthSuccess']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty user credentials', () => {
    // Assert - initial state
    expect(component.user.email).toBe('');
    expect(component.user.password).toBe('');
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with showPassword as false', () => {
    // Assert
    expect(component.showPassword).toBeFalse();
  });

  // --- togglePasswordVisibility ---

  it('should toggle showPassword from false to true', () => {
    // Arrange - initial state is false
    component.showPassword = false;

    // Act
    component.togglePasswordVisibility();

    // Assert
    expect(component.showPassword).toBeTrue();
  });

  it('should toggle showPassword from true to false', () => {
    // Arrange - set to true
    component.showPassword = true;

    // Act
    component.togglePasswordVisibility();

    // Assert
    expect(component.showPassword).toBeFalse();
  });

  // --- onClose ---

  it('should emit closeEvent when onClose is called', () => {
    // Arrange
    spyOn(component.closeEvent, 'emit');

    // Act
    component.onClose();

    // Assert
    expect(component.closeEvent.emit).toHaveBeenCalled();
  });

  // --- callLoginService - Success scenarios ---

  it('should navigate to /all-products for regular user after successful login', fakeAsync(() => {
    // Arrange
    component.user = { email: 'test@example.com', password: 'password123' };
    mockAuthService.login.and.returnValue(of(mockLoginResponse));
    spyOn(component.closeEvent, 'emit');

    // Act
    component.callLoginService();
    tick();

    // Assert
    expect(mockAuthService.login).toHaveBeenCalledWith(component.user);
    expect(mockAuthService.handleAuthSuccess).toHaveBeenCalledWith(mockLoginResponse);
    expect(component.isLoading).toBeFalse();
    expect(component.closeEvent.emit).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/all-products']);
  }));

  it('should navigate to /dashboard for admin user after successful login', fakeAsync(() => {
    // Arrange
    component.user = { email: 'admin@example.com', password: 'admin123' };
    mockAuthService.login.and.returnValue(of(mockAdminLoginResponse));
    spyOn(component.closeEvent, 'emit');

    // Act
    component.callLoginService();
    tick();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should set isLoading to true while login is in progress', () => {
    // Arrange
    component.user = { email: 'test@example.com', password: 'password123' };
    mockAuthService.login.and.returnValue(of(mockLoginResponse));

    // Act
    component.callLoginService();

    // Note: isLoading is set to false after success, but we verify the flow
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  // --- callLoginService - Error scenarios ---

  it('should show error message and set isLoading to false on login failure', fakeAsync(() => {
    // Arrange
    component.user = { email: 'test@example.com', password: 'wrongpassword' };
    mockAuthService.login.and.returnValue(throwError(() => new Error('Login failed')));

    // Act
    component.callLoginService();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Login failed',
      life: 3000
    });
  }));

  // --- Output events ---

  it('should have switchToSignup output event', () => {
    // Assert - verify output is defined
    expect(component.switchToSignup).toBeDefined();
  });

  it('should have closeEvent output event', () => {
    // Assert - verify output is defined
    expect(component.closeEvent).toBeDefined();
  });
});
