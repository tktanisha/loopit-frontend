import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { CategoryRequest, GetCategoryResponse } from '../../../models/category';

import { CategoryService } from '../../../service/category.service';
import { LoaderComponent } from '../../loader/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, TableModule, ButtonModule, Toast],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MessageService],
})

export class CategoryComponent implements OnDestroy {
  private categoryService = inject(CategoryService);
  messageService = inject(MessageService);

  categorySubject!: Subscription;

  showModal:boolean = false;
  isLoading: boolean = false;

  categories: GetCategoryResponse[] = [];

  category: CategoryRequest = {
    name: '',
    price: null,
    security: null,
  };


  ngOnInit(): void {
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.isLoading = true;
    this.categorySubject = this.categoryService.getAllCategory().subscribe({
      next: (res: any) => {
        this.categories = res.categories;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch category ',
          life: 3000,
        });
      },
    });
  }

  toggleModal(open: boolean) {
    this.showModal = open;
  }

  onSubmitCategory(form: NgForm) {
    if (form.valid) {
      this.createCategory(this.category);
      form.reset();
    }
  }

  createCategory(category: CategoryRequest): void {
    this.isLoading = true;

    this.categorySubject = this.categoryService.createCategory(category).subscribe({
      next: (res) => {
        console.log('Category created:', res);
        this.isLoading = false;
        this.toggleModal(false);
        this.fetchAllCategories(); // refresh list
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'category added successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error creating category:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error creating category',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.categorySubject) this.categorySubject.unsubscribe();
  }
}
