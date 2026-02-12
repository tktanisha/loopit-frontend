// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { DashboardHomeComponent } from './dashboard-home.component';
import { SocietyService } from '../../service/society.service';
import { CategoryService } from '../../service/category.service';
import { UserService } from '../../service/user-service';

// We test DashboardHomeComponent because it handles:
// - Fetching and displaying societies, categories, users, and lenders
// - Navigation to different dashboard sections

describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;
  let mockSocietyService: jasmine.SpyObj<SocietyService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockSocietyService = jasmine.createSpyObj('SocietyService', ['fetchAllSociety']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getAllCategory']);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values
    mockSocietyService.fetchAllSociety.and.returnValue(of([] as any));
    mockCategoryService.getAllCategory.and.returnValue(of([] as any));
    mockUserService.getAllUsers.and.returnValue(of({ users: [] } as any));

    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [
        { provide: SocietyService, useValue: mockSocietyService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomeComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the dashboard home component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with empty arrays', () => {
    // Assert
    expect(component.GetAllSocieties).toEqual([]);
    expect(component.GetAllCategories).toEqual([]);
    expect(component.GetAllUsers).toEqual([]);
    expect(component.GetAllLenders).toEqual([]);
  });

  // --- navigateTo ---

  it('should navigate to dashboard path without role', () => {
    // Act
    component.navigateTo('categories');

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/categories']);
  });

  it('should navigate to dashboard path with role query param', () => {
    // Act
    component.navigateTo('users', 'admin');

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/users'], { queryParams: { role: 'admin' } });
  });

  // --- ngOnInit ---

  it('should fetch all data on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockCategoryService.getAllCategory).toHaveBeenCalled();
    expect(mockSocietyService.fetchAllSociety).toHaveBeenCalled();
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
  }));

  // --- ngOnDestroy ---

  it('should have ngOnDestroy method', () => {
    // Assert
    expect(component.ngOnDestroy).toBeDefined();
  });
});

// END AI-generated - Following QuizApplication testing pattern
