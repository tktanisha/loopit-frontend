// Product Service Tests - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ProductService } from './product.service';
import { Product, ProductResponse } from '../models/product';

// We test ProductService because it handles:
// - Fetching all products
// - Creating new products
// - Getting product by ID
// - Updating and deleting products
// - Image upload functionality

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  const mockProduct: Product = {
    id: null,
    lender_id: 'lender-1',
    category_id: '1',
    name: 'Test Product',
    description: 'Test Description',
    duration: 7,
    is_available: true,
    created_at: null
  };

  const mockProductResponse: ProductResponse = {
    product: mockProduct,
    category: { id: 1, name: 'Electronics' } as any,
    user: { id: 'lender-1', full_name: 'Test User' } as any
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- Basic instantiation ---

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- FetchAllProduct ---

  it('should fetch all products with GET request', () => {
    // Arrange
    const mockResponse = {
      data: {
        products: [mockProductResponse]
      }
    };

    // Act
    service.FetchAllProduct().subscribe(data => {
      // Assert
      expect(data.products).toEqual([mockProductResponse]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch products with query params', () => {
    // Arrange
    const mockResponse = {
      data: {
        products: [mockProductResponse]
      }
    };
    const params = { category: 'Electronics' };

    // Act
    service.FetchAllProduct(params).subscribe();

    // Assert - verify HTTP request with params
    const req = httpMock.expectOne(`${ApiUrl}/products?category=Electronics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- CreateProduct ---

  it('should create a product with POST request', () => {
    // Act
    service.CreateProduct(mockProduct).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/products/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({ success: true });
  });

  // --- GetProductById ---

  it('should get product by ID with GET request', () => {
    // Arrange
    const productId = '123';
    const mockResponse = {
      data: mockProductResponse
    };

    // Act
    service.GetProductById(productId).subscribe(data => {
      // Assert
      expect(data).toEqual(mockProductResponse);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/product/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- UpdateProduct ---

  it('should update product with PUT request', () => {
    // Arrange
    const productId = '123';

    // Act
    service.UpdateProduct(productId, mockProduct).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/products/${productId}/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({ success: true });
  });

  // --- DeleteProduct ---

  it('should delete product with DELETE request', () => {
    // Arrange
    const productId = '123';

    // Act
    service.DeleteProduct(productId).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/products/${productId}/delete`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  // --- UploadImage ---

  it('should upload image with POST request', () => {
    // Arrange
    const fileName = 'test.jpg';
    const fileType = 'image/jpeg';
    const base64Content = 'base64encodedcontent';
    const mockResponse = { fileUrl: 'https://example.com/test.jpg' };

    // Act
    service.UploadImage(fileName, fileType, base64Content).subscribe(data => {
      // Assert
      expect(data.fileUrl).toBe(mockResponse.fileUrl);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/images/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      fileName,
      fileType,
      fileContent: base64Content
    });
    req.flush(mockResponse);
  });
});
