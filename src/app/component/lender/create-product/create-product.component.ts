import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';

import { GetCategoryResponse } from '../../../models/category';
import { Product } from '../../../models/product';

import { CategoryService } from '../../../service/category.service';
import { ProductService } from '../../../service/product.service';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-create-product',
  imports: [FormsModule, CommonModule, LoaderComponent, Toast],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  productService: ProductService = inject(ProductService);
  categoryService: CategoryService = inject(CategoryService);
  messageService: MessageService = inject(MessageService);

  router: Router = inject(Router);
  categorySubject!: Subscription;
  productSubject!: Subscription;

  imageUploadTrue: boolean = false;
  isLoading: boolean = false;

  allCategory: GetCategoryResponse[] = [];

  productData: Product = {
    lender_id: null,
    id: null,
    category_id: null,
    name: '',
    description: '',
    duration: null,
    is_available: true,
    created_at: null,
  };

  ngOnInit(): void {
    this.isLoading = true;
    this.categorySubject = this.categoryService.getAllCategory().subscribe({
      next: (data: any) => {
        this.allCategory = data.categories;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  onCategoryChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.productData.category_id = Number(selectedValue);
  }

  onClickCreate(form: NgForm) {
    if (form.valid) {
      this.CreateProduct(this.productData);
    }
    form.reset();
  }

  CreateProduct(product: Product) {
    this.isLoading = true;
    this.productSubject = this.productService.CreateProduct(product).subscribe({
      next: (product: any) => {
        console.log(product);
        this.productData = product;
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully created the product  ',
          life: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create orders ',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy() {
    this.categorySubject?.unsubscribe();
    this.productSubject?.unsubscribe();
  }
}
