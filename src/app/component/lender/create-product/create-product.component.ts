import { Component,inject, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product, ProductResponse } from '../../../models/product';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryService } from '../../../service/category.service';
import { GetCategoryResponse } from '../../../models/category';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-create-product',
  imports: [FormsModule,CommonModule,LoaderComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})

export class CreateProductComponent implements OnInit {

  imageUploadTrue:boolean=false
  router: Router = inject(Router);
  productService: ProductService = inject(ProductService);
  categoryService: CategoryService = inject(CategoryService);

  categorySubject!: Subscription;
  productSubject!: Subscription;

  isLoading: boolean = false;
  allCategory: GetCategoryResponse[] = [];

  productData: Product = {
    lender_id: null,
    id: null,
    category_id: null,
    name: '',
    description: '',
    duration: 0,
    is_available: true,
    created_at: null
  };

  ngOnInit(): void {
    this.categorySubject = this.categoryService.getAllCategory().subscribe({
      next: (data: any) => {
        this.allCategory = data.categories;
      },
      error: (err) => {
        console.log(err);
      }
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
    this.productService.CreateProduct(product).subscribe({
      next: (product: any) => {
        console.log(product);
        this.productData = product;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.categorySubject?.unsubscribe();
    this.productSubject?.unsubscribe();
  }
}

