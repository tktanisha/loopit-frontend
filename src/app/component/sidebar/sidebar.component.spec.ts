// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user-service';
import { LoggedInUser } from '../../models/logged-in-user';

// We test SidebarComponent because it handles:
// - Menu item display based on user role (admin/user)
// - Become lender functionality
// - Sidebar open/close state
// - Lender menu toggle

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let userSubject: BehaviorSubject<LoggedInUser | null>;

  const mockAdminUser = {
    name: 'Admin User',
    user_id: '1',
    role: 'admin'
  } as unknown as LoggedInUser;

  const mockRegularUser = {
    name: 'Regular User',
    user_id: '2',
    role: 'user'
  } as unknown as LoggedInUser;

  beforeEach(async () => {
    // Create BehaviorSubject for user state
    userSubject = new BehaviorSubject<LoggedInUser | null>(null);

    // Create spy objects for dependencies
    mockAuthService = jasmine.createSpyObj('AuthService', ['handleLogout'], {
      user: userSubject
    });
    mockUserService = jasmine.createSpyObj('UserService', ['BecomeLender']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the sidebar component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isOpen as true', () => {
    // Assert
    expect(component.isOpen).toBeTrue();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with isLenderOpen as false', () => {
    // Assert
    expect(component.isLenderOpen).toBeFalse();
  });

  // --- ngOnInit - Role based menu items ---

  it('should set admin menu items when admin user logs in', fakeAsync(() => {
    // Act
    component.ngOnInit();
    userSubject.next(mockAdminUser);
    tick();

    // Assert
    expect(component.loggedInUser).toEqual(mockAdminUser);
    expect(component.loggedInUserRole).toBe('admin');
    expect(component.currentMenuItems).toEqual(component.menuItemsAdmin);
  }));

  it('should set user menu items when regular user logs in', fakeAsync(() => {
    // Act
    component.ngOnInit();
    userSubject.next(mockRegularUser);
    tick();

    // Assert
    expect(component.loggedInUser).toEqual(mockRegularUser);
    expect(component.loggedInUserRole).toBe('user');
    expect(component.currentMenuItems).toEqual(component.menuItemsUser);
  }));

  it('should set loggedInUser to null when no user is logged in', fakeAsync(() => {
    // Act
    component.ngOnInit();
    userSubject.next(null);
    tick();

    // Assert
    expect(component.loggedInUser).toBeNull();
  }));

  // --- closeSidebar ---

  it('should emit closeEvent when closeSidebar is called', () => {
    // Arrange
    spyOn(component.closeEvent, 'emit');

    // Act
    component.closeSidebar();

    // Assert
    expect(component.closeEvent.emit).toHaveBeenCalled();
  });

  // --- toggleLenderMenu ---

  it('should toggle isLenderOpen from false to true', () => {
    // Arrange
    component.isLenderOpen = false;

    // Act
    component.toggleLenderMenu();

    // Assert
    expect(component.isLenderOpen).toBeTrue();
  });

  it('should toggle isLenderOpen from true to false', () => {
    // Arrange
    component.isLenderOpen = true;

    // Act
    component.toggleLenderMenu();

    // Assert
    expect(component.isLenderOpen).toBeFalse();
  });

  // --- handleBecomeLender - Success ---

  it('should call BecomeLender and show success message on success', fakeAsync(() => {
    // Arrange
    mockUserService.BecomeLender.and.returnValue(of({ success: true }));

    // Act
    component.handleBecomeLender();
    tick();

    // Assert
    expect(mockUserService.BecomeLender).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'You are now a lender, now login again!',
      life: 4000
    });
    expect(mockAuthService.handleLogout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));

  // --- handleBecomeLender - Error ---

  it('should show error message when BecomeLender fails', fakeAsync(() => {
    // Arrange
    mockUserService.BecomeLender.and.returnValue(throwError(() => new Error('Network error')));

    // Act
    component.handleBecomeLender();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to become lender ',
      life: 3000
    });
  }));

  // --- Menu items structure ---

  it('should have correct admin menu items', () => {
    // Assert
    expect(component.menuItemsAdmin.length).toBe(4);
    expect(component.menuItemsAdmin[0].label).toBe('Home');
    expect(component.menuItemsAdmin[1].label).toBe('Categories');
    expect(component.menuItemsAdmin[2].label).toBe('Societies');
    expect(component.menuItemsAdmin[3].label).toBe('Users');
  });

  it('should have correct user menu items', () => {
    // Assert
    expect(component.menuItemsUser.length).toBe(4);
    expect(component.menuItemsUser[0].label).toBe('Browse Items');
    expect(component.menuItemsUser[1].label).toBe('My Lend Requests');
    expect(component.menuItemsUser[2].label).toBe('My Orders');
    expect(component.menuItemsUser[3].label).toBe('All Return Requests');
  });

  it('should have correct lender menu items', () => {
    // Assert
    expect(component.menuItemsLender.length).toBe(3);
    expect(component.menuItemsLender[0].label).toBe('Manage Products');
    expect(component.menuItemsLender[1].label).toBe('Lend Requests');
    expect(component.menuItemsLender[2].label).toBe('Orders Received');
  });
});

// END AI-generated - Following QuizApplication testing pattern
