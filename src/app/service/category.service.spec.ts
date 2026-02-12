// Category Service Tests - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CategoryService } from './category.service';
import { CategoryRequest, GetCategoryResponse } from '../models/category';

// We test CategoryService because it handles:
// - Creating new categories
// - Fetching all categories
// - Updating existing categories
// - Deleting categories

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';

  const mockCategory: CategoryRequest = {
    name: 'Electronics'
  } as CategoryRequest;

  const mockCategoryResponse: GetCategoryResponse = {
    id: '1',
    name: 'Electronics'
  } as GetCategoryResponse;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoryService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- Basic instantiation ---

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- createCategory ---

  it('should create a category with POST request', () => {
    // Arrange
    const mockResponse = {
      data: mockCategory
    };

    // Act
    service.createCategory(mockCategory).subscribe(data => {
      // Assert
      expect(data).toEqual(mockCategory);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/categories`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCategory);
    req.flush(mockResponse);
  });

  // --- getAllCategory ---

  it('should fetch all categories with GET request', () => {
    // Arrange
    const mockResponse = {
      data: [mockCategoryResponse]
    };

    // Act
    service.getAllCategory().subscribe(data => {
      // Assert
      expect(data).toEqual([mockCategoryResponse]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle empty category list', () => {
    // Arrange
    const mockResponse = {
      data: []
    };

    // Act
    service.getAllCategory().subscribe(data => {
      // Assert
      expect(data).toEqual([]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- updateCategory ---

  it('should update category with PUT request', () => {
    // Arrange
    const categoryId = '123';

    // Act
    service.updateCategory(categoryId, mockCategory).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/categories/${categoryId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockCategory);
    req.flush({ success: true });
  });

  // --- deleteCategory ---

  it('should delete category with DELETE request', () => {
    // Arrange
    const categoryId = '123';

    // Act
    service.deleteCategory(categoryId).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/categories/${categoryId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
