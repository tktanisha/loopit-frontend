import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { ProductModalComponent } from '../product-modal/product-modal.component';
import { LoaderComponent } from '../../loader/loader';
import { ProductService } from '../../../service/product.service';
import { CategoryService } from '../../../service/category.service';

import { ProductResponse } from '../../../models/product';
import { GetCategoryResponse } from '../../../models/category';

@Component({
  selector: 'app-browse-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Toast,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    ProductModalComponent,
    LoaderComponent,
  ],
  templateUrl: './browse-items.component.html',
  styleUrl: './browse-items.component.scss',
  providers: [MessageService],
})
export class GetAllProductComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  messageService = inject(MessageService);
  router: Router = inject(Router);

  productSubject!: Subscription;
  categorySubject!: Subscription;

  isLoading = false;
  isOpenModal = false;

  allProduct: ProductResponse[] = [];
  allCategory: GetCategoryResponse[] = [];

  selectedProduct!: ProductResponse;

  // filters
  searchTerm = '';
  selectedCategoryId: number | null = null;
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.fetchAllCategories();
    this.fetchAllProducts();

    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.fetchAllProducts());
  }

  fetchAllProducts() {
    this.isLoading = true;
    const params: any = {};

    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedCategoryId) params.category_id = this.selectedCategoryId;

    this.productSubject = this.productService.FetchAllProduct(params).subscribe({
      next: (res: any) => {
        this.allProduct = res.products || [];
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

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  applyFilters() {
    this.fetchAllProducts();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.fetchAllProducts();
  }

  handleOpenModal(product: ProductResponse) {
    this.selectedProduct = product;
    this.isOpenModal = true;
  }

  handleOnClose() {
    this.isOpenModal = false;
  }

  ngOnDestroy(): void {
    this.productSubject?.unsubscribe();
    this.categorySubject?.unsubscribe();
    this.searchSubject.complete();
  }
}
