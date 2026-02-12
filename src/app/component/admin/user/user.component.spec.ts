// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

import { UserComponent } from './user.component';
import { UserService } from '../../../service/user-service';
import { SocietyService } from '../../../service/society.service';
import { User } from '../../../models/user';

// We test UserComponent because it handles:
// - Fetching and displaying users
// - Filtering users by search, society, and role
// - Viewing user details

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockSocietyService: jasmine.SpyObj<SocietyService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockUsers: User[] = [
    { id: '1', full_name: 'Test User', email: 'test@test.com', role: 'user' } as unknown as User
  ];

  const mockSocieties = [
    { id: '1', name: 'Society 1' }
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers', 'deleteUser']);
    mockSocietyService = jasmine.createSpyObj('SocietyService', ['fetchAllSociety']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - getAllUsers returns array directly, fetchAllSociety returns object with societies property
    mockUserService.getAllUsers.and.returnValue(of(mockUsers as any));
    mockSocietyService.fetchAllSociety.and.returnValue(of({ societies: mockSocieties } as any));

    await TestBed.configureTestingModule({
      imports: [UserComponent, FormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SocietyService, useValue: mockSocietyService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: MessageService, useValue: mockMessageService },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            queryParams: of({})
          } 
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the user component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty users array', () => {
    // Assert
    expect(component.users).toEqual([]);
  });

  it('should initialize with empty societies array', () => {
    // Assert
    expect(component.societies).toEqual([]);
  });

  it('should initialize roles array with options', () => {
    // Assert
    expect(component.roles.length).toBe(4);
    expect(component.roles[0].label).toBe('All');
  });

  // --- ngOnInit ---

  it('should subscribe to query params on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
  }));

  it('should fetch societies on init', fakeAsync(() => {
    // Arrange
    spyOn(component, 'fetchAllSocieties').and.callThrough();

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(component.fetchAllSocieties).toHaveBeenCalled();
  }));

  // --- fetchAllUsers ---

  it('should fetch all users', fakeAsync(() => {
    // Act
    component.fetchAllUsers();
    tick();

    // Assert
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  }));

  it('should include search term in params', fakeAsync(() => {
    // Arrange
    component.searchTerm = 'test';

    // Act
    component.fetchAllUsers();
    tick();

    // Assert
    expect(mockUserService.getAllUsers).toHaveBeenCalledWith(jasmine.objectContaining({
      search: 'test'
    }));
  }));

  it('should include role filter in params', fakeAsync(() => {
    // Arrange
    component.selectedRole = 'admin';

    // Act
    component.fetchAllUsers();
    tick();

    // Assert
    expect(mockUserService.getAllUsers).toHaveBeenCalledWith(jasmine.objectContaining({
      role: 'admin'
    }));
  }));

  it('should show error message when fetch fails', fakeAsync(() => {
    // Arrange
    mockUserService.getAllUsers.and.returnValue(throwError(() => new Error('Network error')));

    // Act
    component.fetchAllUsers();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- fetchAllSocieties ---

  it('should fetch all societies', fakeAsync(() => {
    // Act
    component.fetchAllSocieties();
    tick();

    // Assert
    expect(mockSocietyService.fetchAllSociety).toHaveBeenCalled();
    expect(component.societies).toEqual(mockSocieties);
  }));

  // --- applyFilters ---

  it('should call fetchAllUsers when applying filters', fakeAsync(() => {
    // Arrange
    spyOn(component, 'fetchAllUsers').and.callThrough();

    // Act
    component.applyFilters();
    tick();

    // Assert
    expect(component.fetchAllUsers).toHaveBeenCalled();
  }));

  // --- clearFilters ---

  it('should reset filter values and fetch users', fakeAsync(() => {
    // Arrange
    component.searchTerm = 'test';
    component.selectedSocietyId = 1;
    component.selectedRole = 'admin';

    // Act
    component.clearFilters();
    tick();

    // Assert
    expect(component.searchTerm).toBe('');
    expect(component.selectedSocietyId).toBeNull();
    expect(component.selectedRole).toBeNull();
  }));

  // --- viewUser ---

  it('should show user info message', () => {
    // Arrange
    const user = mockUsers[0];

    // Act
    component.viewUser(user);

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'info',
      summary: 'User Info'
    }));
  });
});

// END AI-generated - Following QuizApplication testing pattern
