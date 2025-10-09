import { Component, inject } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';

import { SocietyPayload } from '../../models/society';
import { GetCategoryResponse } from '../../models/category';

import { SocietyService } from '../../service/society.service';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-dashboard-home',
  imports: [Toast],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent {
  societyService = inject(SocietyService);
  categoryService = inject(CategoryService);
  messageService = inject(MessageService);

  societySubject!: Subscription;
  categorySubject!: Subscription;

  isLoading: boolean = false;

  GetAllSocieties: SocietyPayload[] = [];

  GetAllCategories: GetCategoryResponse[] = [];

  ngOnInit(): void {
    this.fetchAllSociety();
    this.fetchAllCategory();
  }

  fetchAllSociety() {
    this.isLoading = true;
    this.societySubject = this.societyService.fetchAllSociety().subscribe({
      next: (res: any) => {
        this.GetAllSocieties = res.societies;
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully fetched society ',
          life: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to fetch society ',
          life: 3000,
        });
      },
    });
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
    if (this.societySubject) {
      this.societySubject.unsubscribe();
    }
    if (this.categorySubject) {
      this.categorySubject.unsubscribe();
    }
  }
}
