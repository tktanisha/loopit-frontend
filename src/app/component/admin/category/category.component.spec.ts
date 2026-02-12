// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

import { CategoryComponent } from './category.component';
import { CategoryService } from '../../../service/category.service';
import { GetCategoryResponse } from '../../../models/category';

// We test CategoryComponent because it handles:
// - Fetching and displaying categories
// - Creating and updating categories
// - Deleting categories with confirmation

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockCategories: GetCategoryResponse[] = [
    { id: '1', name: 'Category 1', price: 100, security: 50 } as unknown as GetCategoryResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getAllCategory', 'createCategory', 'updateCategory', 'deleteCategory']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values
    mockCategoryService.getAllCategory.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [CategoryComponent, FormsModule],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the category component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with showModal as false', () => {
    // Assert
    expect(component.showModal).toBeFalse();
  });

  it('should initialize with isEditMode as false', () => {
    // Assert
    expect(component.isEditMode).toBeFalse();
  });

  it('should initialize with empty categories array', () => {
    // Assert
    expect(component.categories).toEqual([]);
  });

  // --- ngOnInit ---

  it('should call fetchAllCategories on init', fakeAsync(() => {
    // Arrange
    spyOn(component, 'fetchAllCategories').and.callThrough();

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(component.fetchAllCategories).toHaveBeenCalled();
  }));

  // --- fetchAllCategories ---

  it('should fetch all categories', fakeAsync(() => {
    // Act
    component.fetchAllCategories();
    tick();

    // Assert
    expect(mockCategoryService.getAllCategory).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  }));

  it('should show error message when fetch fails', fakeAsync(() => {
    // Arrange
    mockCategoryService.getAllCategory.and.returnValue(throwError(() => new Error('Network error')));

    // Act
    component.fetchAllCategories();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- toggleModal ---

  it('should open modal in create mode', () => {
    // Act
    component.toggleModal(true);

    // Assert
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeFalse();
    expect(component.selectedCategoryId).toBeNull();
  });

  it('should open modal in edit mode with category data', () => {
    // Arrange
    const category = mockCategories[0];

    // Act
    component.toggleModal(true, category);

    // Assert
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeTrue();
    expect(component.selectedCategoryId).toBe('1');
  });

  it('should close modal', () => {
    // Arrange
    component.showModal = true;

    // Act
    component.toggleModal(false);

    // Assert
    expect(component.showModal).toBeFalse();
  });

  // --- createCategory ---

  it('should create category and show success message', fakeAsync(() => {
    // Arrange
    mockCategoryService.createCategory.and.returnValue(of({} as any));
    mockCategoryService.getAllCategory.and.returnValue(of(mockCategories as any));

    // Act
    component.createCategory({ name: 'New Category', price: 100, security: 50 });
    tick();

    // Assert
    expect(mockCategoryService.createCategory).toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
  }));

  it('should close modal after creating category', fakeAsync(() => {
    // Arrange
    mockCategoryService.createCategory.and.returnValue(of({} as any));
    mockCategoryService.getAllCategory.and.returnValue(of(mockCategories as any));
    component.showModal = true;

    // Act
    component.createCategory({ name: 'New Category', price: 100, security: 50 });
    tick();

    // Assert
    expect(component.showModal).toBeFalse();
  }));

  it('should show error message when create fails', fakeAsync(() => {
    // Arrange
    mockCategoryService.createCategory.and.returnValue(throwError(() => new Error('Create failed')));

    // Act
    component.createCategory({ name: 'New Category', price: 100, security: 50 });
    tick();

    // Assert
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- updateCategory ---

  it('should update category and show success message', fakeAsync(() => {
    // Arrange
    mockCategoryService.updateCategory.and.returnValue(of({}));
    mockCategoryService.getAllCategory.and.returnValue(of(mockCategories as any));

    // Act
    component.updateCategory('1', { name: 'Updated Category', price: 150, security: 75 });
    tick();

    // Assert
    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith('1', jasmine.any(Object));
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Updated'
    }));
  }));
});

// END AI-generated - Following QuizApplication testing pattern
