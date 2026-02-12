// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../service/auth.service';
import { LoggedInUser } from '../../models/logged-in-user';

// Mock child components to avoid subscription issues during cleanup
@Component({ selector: 'app-header', template: '', standalone: true })
class MockHeaderComponent {}

@Component({ selector: 'app-sidebar', template: '', standalone: true })
class MockSidebarComponent {}

// We test DashboardComponent because it handles:
// - Main dashboard layout with sidebar
// - Sidebar toggle functionality

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let userSubject: BehaviorSubject<LoggedInUser | null>;

  beforeEach(async () => {
    // Create BehaviorSubject for user state
    userSubject = new BehaviorSubject<LoggedInUser | null>(null);

    // Create spy objects for dependencies - include user property for child components
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser', 'handleLogout'], {
      user: userSubject
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(DashboardComponent, {
      set: { imports: [MockHeaderComponent, MockSidebarComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the dashboard component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isSidebarOpen as true', () => {
    // Assert
    expect(component.isSidebarOpen).toBeTrue();
  });

  // --- handleToggleSidebar ---

  it('should toggle sidebar from open to closed', () => {
    // Arrange
    component.isSidebarOpen = true;

    // Act
    component.handleToggleSidebar();

    // Assert
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should toggle sidebar from closed to open', () => {
    // Arrange
    component.isSidebarOpen = false;

    // Act
    component.handleToggleSidebar();

    // Assert
    expect(component.isSidebarOpen).toBeTrue();
  });

  // --- handleCloseSidebar ---

  it('should close sidebar', () => {
    // Arrange
    component.isSidebarOpen = true;

    // Act
    component.handleCloseSidebar();

    // Assert
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should keep sidebar closed when already closed', () => {
    // Arrange
    component.isSidebarOpen = false;

    // Act
    component.handleCloseSidebar();

    // Assert
    expect(component.isSidebarOpen).toBeFalse();
  });
});

// END AI-generated - Following QuizApplication testing pattern
