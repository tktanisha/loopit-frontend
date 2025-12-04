import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';

import { LoaderComponent } from '../../loader/loader';
import { ProductService } from '../../../service/product.service';
import { CategoryService } from '../../../service/category.service';

import { GetCategoryResponse } from '../../../models/category';
import { Product, ProductResponse } from '../../../models/product';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    TableModule,
    ButtonModule,
    Toast,
    ConfirmDialogModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class CreateProductComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);
  private authService = inject(AuthService);
  messageService = inject(MessageService);

  productSubject!: Subscription;
  categorySubject!: Subscription;

  isLoading = false;
  showModal = false;
  isEditMode = false;

  allProducts: ProductResponse[] = [];
  allCategory: GetCategoryResponse[] = [];

  // Filters
  searchTerm = '';
  selectedCategoryId: number | null = null;
  selectedAvailability: string | null = null;

  // Pagination & sorting
  rows = 8;
  first = 0;
  totalRecords = 0;

  selectedImage!: File;
  imagePreview: string | null = null;
  maxFileSize = 1 * 1024 * 1024;
  safeFileName: string = ' ';

  product: Product = {
    id: null,
    lender_id: null,
    category_id: null,
    name: '',
    description: '',
    image_url: '',
    duration: null,
    is_available: true,
    created_at: null,
  };

  selectedProductId: string | null = null;

  currentLenderId!: string | undefined;
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.currentLenderId = this.authService.getUser()?.user_id;
    this.fetchAllCategories();
    this.fetchAllProducts();
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.fetchAllProducts();
    });
  }

  fetchAllProducts() {
    this.isLoading = true;
    const params: any = {
      lender_id: this.currentLenderId,
    };

    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedCategoryId) params.category_id = this.selectedCategoryId;
    if (this.selectedAvailability) params.is_available = this.selectedAvailability;

    this.productSubject = this.productService.FetchAllProduct(params).subscribe({
      next: (res: any) => {
        this.allProducts = res.products || [];
        this.totalRecords = this.allProducts.length;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch products',
          life: 3000,
        });
      },
    });
  }

  fetchAllCategories() {
    this.categorySubject = this.categoryService.getAllCategory().subscribe({
      next: (res: any) => (this.allCategory = res.categories),
      error: err => console.error('Error fetching categories:', err),
    });
  }

  applyFilters() {
    this.fetchAllProducts();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.selectedAvailability = null;
    this.fetchAllProducts();
  }

  toggleModal(open: boolean, product?: ProductResponse) {
    this.showModal = open;

    if (open && product) {
      this.isEditMode = true;
      this.selectedProductId = product.product.id;
      this.product = { ...product.product };
    } else if (open && !product) {
      this.isEditMode = false;
      this.selectedProductId = null;
      this.product = {
        id: null,
        lender_id: null,
        category_id: null,
        name: '',
        description: '',
        duration: null,
        is_available: true,
        created_at: null,
      };
    }
  }

  onSubmitProduct(form: NgForm) {
    if (!form.valid) {
      alert('Please fill all required fields.');
      return;
    }

    if (!this.selectedImage) {
      alert('Please upload an image.');
      return;
    }

    this.isLoading = true;

    this.productService.getPresignedUrl(this.safeFileName).subscribe({
      next: res => {
        console.log('hello');
        this.productService.uploadImageToS3(res.uploadUrl, this.selectedImage).subscribe({
          next: res1 => {
            console.log(res1);
            console.log('after returning from uplaod to s3');
            this.product.image_url = res.fileUrl;

            if (this.isEditMode && this.selectedProductId !== null) {
              this.updateProduct(this.selectedProductId, this.product);
            } else {
              console.log('before calling create product');
              this.createProduct(this.product);
              console.log('after callling');
            }
            this.imagePreview = null;
            form.reset();
          },
          error: err => {
            this.isLoading = false;
            console.error('Error uploading image:', err);
          },
        });
      },
      error: err => {
        this.isLoading = false;
        console.error('Error getting presigned URL:', err);
        alert('Failed to get upload URL.');
      },
    });
  }

  createProduct(product: Product) {
    this.isLoading = true;
    this.productSubject = this.productService.CreateProduct(product).subscribe({
      next: () => {
        this.isLoading = false;
        this.toggleModal(false);
        this.fetchAllProducts();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error creating product:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error creating product',
          life: 3000,
        });
      },
    });
  }

  updateProduct(id: string, product: Product) {
    this.isLoading = true;
    this.productSubject = this.productService.UpdateProduct(id, product).subscribe({
      next: () => {
        this.isLoading = false;
        this.toggleModal(false);
        this.fetchAllProducts();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Product updated successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error updating product:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating product',
          life: 3000,
        });
      },
    });
  }

  confirmDeleteProduct(product: ProductResponse) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${product.product.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteProduct(product.product.id),
    });
  }

  deleteProduct(id: string | null) {
    if (id === null) return;
    this.isLoading = true;
    this.productSubject = this.productService.DeleteProduct(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.fetchAllProducts();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Product deleted successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error deleting product:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting product',
          life: 3000,
        });
      },
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.size > this.maxFileSize) {
        alert('File size exceeds 1MB. Please upload a smaller image.');
        input.value = '';
        this.imagePreview = null;
        return;
      }

      this.selectedImage = file;
      this.safeFileName = this.selectedImage.name.replace(/\s+/g, '_');

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  ngOnDestroy() {
    this.productSubject?.unsubscribe();
    this.categorySubject?.unsubscribe();
    this.searchSubject.complete();
  }
}
