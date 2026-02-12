// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule, NgForm } from '@angular/forms';

import { CreateProductComponent } from './create-product.component';
import { ProductService } from '../../../service/product.service';
import { CategoryService } from '../../../service/category.service';
import { AuthService } from '../../../service/auth.service';
import { ProductResponse } from '../../../models/product';
import { GetCategoryResponse } from '../../../models/category';
import { LoggedInUser } from '../../../models/logged-in-user';

// We test CreateProductComponent because it handles:
// - Fetching and displaying products
// - Creating and updating products
// - Image upload functionality
// - Category filtering

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockUser = {
    name: 'Test Lender',
    user_id: 'lender-1',
    role: 'lender'
  } as unknown as LoggedInUser;

  const mockProducts: ProductResponse[] = [
    { product: { id: '1', name: 'Product 1', lender_id: 'lender-1', category_id: 1 } } as unknown as ProductResponse
  ];

  const mockCategories: GetCategoryResponse[] = [
    { id: 1, name: 'Category 1' } as unknown as GetCategoryResponse
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockProductService = jasmine.createSpyObj('ProductService', ['FetchAllProduct', 'CreateProduct', 'UpdateProduct', 'DeleteProductById', 'UploadImage']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getAllCategory']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - component expects res to be array directly
    mockProductService.FetchAllProduct.and.returnValue(of(mockProducts as any));
    mockCategoryService.getAllCategory.and.returnValue(of(mockCategories as any));
    mockAuthService.getUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [CreateProductComponent, FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Safe cleanup - only unsubscribe if subscriptions exist
    if (component.productSubject) {
      component.productSubject.unsubscribe();
    }
    if (component.categorySubject) {
      component.categorySubject.unsubscribe();
    }
  });

  // --- Basic instantiation ---

  it('should create the create-product component', () => {
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

  it('should initialize with empty allProducts array', () => {
    // Assert
    expect(component.allProducts).toEqual([]);
  });

  it('should initialize with empty allCategory array', () => {
    // Assert
    expect(component.allCategory).toEqual([]);
  });

  // --- ngOnInit ---

  it('should get current lender id on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.currentLenderId).toBe('lender-1');
  }));

  it('should fetch categories on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockCategoryService.getAllCategory).toHaveBeenCalled();
  }));

  it('should fetch products on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(mockProductService.FetchAllProduct).toHaveBeenCalled();
  }));

  // --- fetchAllProducts ---

  it('should fetch all products for lender', fakeAsync(() => {
    // Arrange
    component.currentLenderId = 'lender-1';

    // Act
    component.fetchAllProducts();
    tick();

    // Assert
    expect(mockProductService.FetchAllProduct).toHaveBeenCalledWith(jasmine.objectContaining({
      lender_id: 'lender-1'
    }));
    expect(component.allProducts).toEqual(mockProducts);
  }));

  it('should include search term in fetch params', fakeAsync(() => {
    // Arrange
    component.currentLenderId = 'lender-1';
    component.searchTerm = 'test';

    // Act
    component.fetchAllProducts();
    tick();

    // Assert
    expect(mockProductService.FetchAllProduct).toHaveBeenCalledWith(jasmine.objectContaining({
      search: 'test'
    }));
  }));

  it('should show error message when fetch products fails', fakeAsync(() => {
    // Arrange
    mockProductService.FetchAllProduct.and.returnValue(throwError(() => new Error('Network error')));
    component.currentLenderId = 'lender-1';

    // Act
    component.fetchAllProducts();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- fetchAllCategories ---

  it('should fetch all categories', fakeAsync(() => {
    // Act
    component.fetchAllCategories();
    tick();

    // Assert
    expect(mockCategoryService.getAllCategory).toHaveBeenCalled();
    expect(component.allCategory).toEqual(mockCategories);
  }));

  // --- toggleModal ---

  it('should open modal in create mode', () => {
    // Act
    component.toggleModal(true);

    // Assert
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeFalse();
    expect(component.selectedProductId).toBeNull();
  });

  it('should open modal in edit mode with product data', () => {
    // Arrange
    const productResponse = mockProducts[0];

    // Act
    component.toggleModal(true, productResponse);

    // Assert
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeTrue();
    expect(component.selectedProductId).toBe('1');
  });

  it('should close modal', () => {
    // Arrange
    component.showModal = true;

    // Act
    component.toggleModal(false);

    // Assert
    expect(component.showModal).toBeFalse();
  });

  // --- applyFilters ---

  it('should call fetchAllProducts when applying filters', fakeAsync(() => {
    // Arrange
    component.currentLenderId = 'lender-1';
    spyOn(component, 'fetchAllProducts').and.callThrough();

    // Act
    component.applyFilters();
    tick();

    // Assert
    expect(component.fetchAllProducts).toHaveBeenCalled();
  }));

  // --- clearFilters ---

  it('should reset filter values and fetch products', fakeAsync(() => {
    // Arrange
    component.currentLenderId = 'lender-1';
    component.searchTerm = 'test';
    component.selectedCategoryId = 1;
    component.selectedAvailability = 'true';

    // Act
    component.clearFilters();
    tick();

    // Assert
    expect(component.searchTerm).toBe('');
    expect(component.selectedCategoryId).toBeNull();
    expect(component.selectedAvailability).toBeNull();
  }));

  // --- createProduct ---

  it('should create product and show success message', fakeAsync(() => {
    // Arrange
    mockProductService.CreateProduct.and.returnValue(of({}));
    mockProductService.FetchAllProduct.and.returnValue(of(mockProducts as any));
    component.currentLenderId = 'lender-1';

    // Act
    component.createProduct(component.product);
    tick();

    // Assert
    expect(mockProductService.CreateProduct).toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
  }));

  it('should close modal after creating product', fakeAsync(() => {
    // Arrange
    mockProductService.CreateProduct.and.returnValue(of({}));
    mockProductService.FetchAllProduct.and.returnValue(of(mockProducts as any));
    component.showModal = true;
    component.currentLenderId = 'lender-1';

    // Act
    component.createProduct(component.product);
    tick();

    // Assert
    expect(component.showModal).toBeFalse();
  }));
});

// END AI-generated - Following QuizApplication testing pattern
