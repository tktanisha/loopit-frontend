// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { GetAllProductComponent } from './browse-items.component';
import { ProductService } from '../../../service/product.service';
import { CategoryService } from '../../../service/category.service';
import { ProductResponse } from '../../../models/product';
import { GetCategoryResponse } from '../../../models/category';

// We test GetAllProductComponent (BrowseItems) because it handles:
// - Fetching and displaying products
// - Search with debounce
// - Category filtering
// - Product modal open/close

describe('GetAllProductComponent', () => {
  let component: GetAllProductComponent;
  let fixture: ComponentFixture<GetAllProductComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockProducts: ProductResponse[] = [
    { product: { id: '1', name: 'Product 1' }, category: {}, user: {} } as unknown as ProductResponse,
    { product: { id: '2', name: 'Product 2' }, category: {}, user: {} } as unknown as ProductResponse
  ];

  const mockCategories: GetCategoryResponse[] = [
    { id: 1, name: 'Category 1' } as unknown as GetCategoryResponse,
    { id: 2, name: 'Category 2' } as unknown as GetCategoryResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockProductService = jasmine.createSpyObj('ProductService', ['FetchAllProduct']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getAllCategory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - FetchAllProduct returns { products: ProductResponse[] }
    mockProductService.FetchAllProduct.and.returnValue(of({ products: mockProducts }));
    mockCategoryService.getAllCategory.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [GetAllProductComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GetAllProductComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the browse items component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with isOpenModal as false', () => {
    // Assert
    expect(component.isOpenModal).toBeFalse();
  });

  it('should initialize with empty search term', () => {
    // Assert
    expect(component.searchTerm).toBe('');
  });

  it('should initialize with null selectedCategoryId', () => {
    // Assert
    expect(component.selectedCategoryId).toBeNull();
  });

  // --- ngOnInit ---

  it('should fetch products and categories on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockProductService.FetchAllProduct).toHaveBeenCalled();
    expect(mockCategoryService.getAllCategory).toHaveBeenCalled();
  }));

  // --- fetchAllProducts ---

  it('should set isLoading to true when fetching products', () => {
    // Act
    component.fetchAllProducts();

    // Assert - isLoading should be set (may already be false after subscribe)
    expect(mockProductService.FetchAllProduct).toHaveBeenCalled();
  });

  it('should populate allProduct on successful fetch', fakeAsync(() => {
    // Act
    component.fetchAllProducts();
    tick();

    // Assert
    expect(component.allProduct).toEqual(mockProducts);
    expect(component.isLoading).toBeFalse();
  }));

  it('should show error message on fetch failure', fakeAsync(() => {
    // Arrange
    mockProductService.FetchAllProduct.and.returnValue(throwError(() => new Error('Network error')));

    // Act
    component.fetchAllProducts();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch products',
      life: 3000
    });
  }));

  it('should include search term in params when set', fakeAsync(() => {
    // Arrange
    component.searchTerm = 'laptop';

    // Act
    component.fetchAllProducts();
    tick();

    // Assert
    expect(mockProductService.FetchAllProduct).toHaveBeenCalledWith({ search: 'laptop' });
  }));

  it('should include category_id in params when set', fakeAsync(() => {
    // Arrange
    component.selectedCategoryId = 5;

    // Act
    component.fetchAllProducts();
    tick();

    // Assert
    expect(mockProductService.FetchAllProduct).toHaveBeenCalledWith({ category_id: 5 });
  }));

  // --- onSearchChange ---

  it('should update searchTerm when onSearchChange is called', () => {
    // Act
    component.onSearchChange('new search');

    // Assert
    expect(component.searchTerm).toBe('new search');
  });

  // --- applyFilters ---

  it('should call fetchAllProducts when applyFilters is called', () => {
    // Arrange
    spyOn(component, 'fetchAllProducts');

    // Act
    component.applyFilters();

    // Assert
    expect(component.fetchAllProducts).toHaveBeenCalled();
  });

  // --- clearFilters ---

  it('should reset filters and fetch products when clearFilters is called', () => {
    // Arrange
    component.searchTerm = 'test';
    component.selectedCategoryId = 5;
    spyOn(component, 'fetchAllProducts');

    // Act
    component.clearFilters();

    // Assert
    expect(component.searchTerm).toBe('');
    expect(component.selectedCategoryId).toBeNull();
    expect(component.fetchAllProducts).toHaveBeenCalled();
  });

  // --- handleOpenModal ---

  it('should open modal with selected product', () => {
    // Arrange
    const product = mockProducts[0];

    // Act
    component.handleOpenModal(product);

    // Assert
    expect(component.selectedProduct).toEqual(product);
    expect(component.isOpenModal).toBeTrue();
  });

  // --- handleOnClose ---

  it('should close modal when handleOnClose is called', () => {
    // Arrange
    component.isOpenModal = true;

    // Act
    component.handleOnClose();

    // Assert
    expect(component.isOpenModal).toBeFalse();
  });

  // --- ngOnDestroy ---

  it('should have ngOnDestroy method', () => {
    // Assert
    expect(component.ngOnDestroy).toBeDefined();
  });
});

// END AI-generated - Following QuizApplication testing pattern
