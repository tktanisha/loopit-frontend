import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';

import { GetCategoryResponse } from '../../../models/category';

import { CategoryService } from '../../../service/category.service';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-get-category',
  imports: [CommonModule, LoaderComponent, Toast],
  templateUrl: './get-category.component.html',
  styleUrl: './get-category.component.scss',
})
export class GetCategoryComponent implements OnInit {
  categoryService = inject(CategoryService);
  messageService = inject(MessageService);
  router: Router = inject(Router);

  categorySubject!: Subscription;

  isLoading: boolean = false;

  GetAllCategories: GetCategoryResponse[] = [];

  ngOnInit(): void {
    this.fetchAllCategory();
  }

  fetchAllCategory() {
    this.isLoading = true;
    this.categorySubject = this.categoryService.getAllCategory().subscribe({
      next: (res: any) => {
        this.GetAllCategories = res.categories;
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully fetched category ',
          life: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to fetch category ',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.categorySubject) {
      this.categorySubject.unsubscribe();
    }
  }
}
