import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OnDestroy } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { CategoryRequest } from '../../../models/category';

import { CategoryService } from '../../../service/category.service';
import { LoaderComponent } from '../../loader/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-category',
  imports: [FormsModule, LoaderComponent, Toast],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MessageService],
})
export class CategoryComponent implements OnDestroy {
  private categoryService = inject(CategoryService);
  messageService = inject(MessageService);

  categorySubject!: Subscription;

  isLoading: boolean = false;

  category: CategoryRequest = {
    name: '',
    price: null,
    security: null,
  };

  onSubmitCategory(form: NgForm) {
    if (form.valid) {
      this.createCategory(this.category);
      form.reset();
    }
  }

  createCategory(category: CategoryRequest): void {
    this.isLoading = true;

    this.categorySubject = this.categoryService.createCategory(category).subscribe({
      next: res => {
        console.log('Category created:', res);
        this.isLoading = false;
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
          severity: 'danger',
          summary: 'Error',
          detail: 'Error creating category',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.categorySubject.unsubscribe();
  }
}
