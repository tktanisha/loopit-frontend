// User Service Tests - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserService } from './user-service';
import { User } from '../models/user';

// We test UserService because it handles:
// - Becoming a lender
// - Fetching all users
// - Getting user by ID
// - Deleting users

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const ApiUrl = '';

  const mockUser: User = {
    id: '1',
    full_name: 'Test User',
    email: 'test@example.com',
    phone_number: '1234567890',
    created_at: null,
    password_hash: null,
    address: 'Test Address',
    society_id: null,
    role: 'user' as any
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- Basic instantiation ---

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- BecomeLender ---

  it('should call BecomeLender with PATCH request', () => {
    // Act
    service.BecomeLender().subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/users/become-lender`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush({ success: true });
  });

  // --- getAllUsers ---

  it('should fetch all users with GET request', () => {
    // Arrange
    const mockResponse = {
      data: {
        users: [mockUser]
      }
    };

    // Act
    service.getAllUsers().subscribe(data => {
      // Assert
      expect(data.users).toEqual([mockUser]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch users with query params', () => {
    // Arrange
    const mockResponse = {
      data: {
        users: [mockUser]
      }
    };
    const params = { role: 'admin' };

    // Act
    service.getAllUsers(params).subscribe();

    // Assert - verify HTTP request with params
    const req = httpMock.expectOne(`${ApiUrl}/users?role=admin`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle multiple query params', () => {
    // Arrange
    const mockResponse = {
      data: {
        users: [mockUser]
      }
    };
    const params = { role: 'admin', status: 'active' };

    // Act
    service.getAllUsers(params).subscribe();

    // Assert - verify HTTP request with params
    const req = httpMock.expectOne((request) => 
      request.url.includes(`${ApiUrl}/users`) && 
      request.url.includes('role=admin') && 
      request.url.includes('status=active')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- getUserById ---

  it('should get user by ID with GET request', () => {
    // Arrange
    const userId = '123';
    const mockResponse = {
      data: {
        user: mockUser
      }
    };

    // Act
    service.getUserById(userId).subscribe(user => {
      // Assert
      expect(user).toEqual(mockUser);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- deleteUser ---

  it('should delete user with DELETE request', () => {
    // Arrange
    const userId = '123';

    // Act
    service.deleteUser(userId).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
