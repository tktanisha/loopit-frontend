// Auth Service Tests - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from '../models/login';
import { SignUpRequest } from '../models/signup';

// We test AuthService because it handles authentication logic including:
// - Login/Signup API calls
// - Token management
// - User state management
// - Token expiration checks

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockLoginResponse: LoginResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.test',
    user: {
      id: '1',
      Name: 'Test User',
      Role: 'user'
    }
  };

  beforeEach(() => {
    // Create spy for Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // --- Basic instantiation ---

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- isLoggedIn ---

  it('should return false when no token exists in localStorage', () => {
    // Arrange - ensure localStorage is empty
    localStorage.removeItem('auth_token');

    // Act
    const result = service.isLoggedIn();

    // Assert
    expect(result).toBeFalse();
  });

  it('should return true when token exists in localStorage', () => {
    // Arrange - set a token in localStorage
    localStorage.setItem('auth_token', 'test-token');

    // Act
    const result = service.isLoggedIn();

    // Assert
    expect(result).toBeTrue();
  });

  // --- getToken ---

  it('should return null when no token is stored', () => {
    // Arrange - ensure no token
    localStorage.removeItem('auth_token');

    // Act
    const token = service.getToken();

    // Assert
    expect(token).toBeNull();
  });

  it('should return the stored token', () => {
    // Arrange - store a token
    const expectedToken = 'my-jwt-token';
    localStorage.setItem('auth_token', expectedToken);

    // Act
    const token = service.getToken();

    // Assert
    expect(token).toBe(expectedToken);
  });

  // --- handleLogout ---

  it('should clear localStorage and navigate to home on logout', () => {
    // Arrange - setup localStorage with auth data
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify({ ID: '1', Name: 'Test' }));

    // Act
    service.handleLogout();

    // Assert - localStorage should be cleared
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    // User BehaviorSubject should be null
    expect(service.user.value).toBeNull();
    // Should navigate to home
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  // --- isAdmin ---

  it('should return false when no user is logged in', () => {
    // Arrange - ensure no user
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');

    // Act
    const result = service.isAdmin();

    // Assert
    expect(result).toBeFalse();
  });

  // --- login ---

  it('should call login API with correct credentials', () => {
    // Arrange
    const loginData: LoginRequest = { email: 'test@example.com', password: 'password123' };

    // Act
    service.login(loginData).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne('http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);

    // Complete the request
    req.flush(mockLoginResponse);
  });

  // --- logout API call ---

  it('should call logout API', () => {
    // Act
    service.logout().subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne('http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    // Complete the request
    req.flush({});
  });

  // --- getUser ---

  it('should return null when no user data exists', () => {
    // Arrange - ensure no user data
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');

    // Act
    const user = service.getUser();

    // Assert
    expect(user).toBeNull();
  });
});
