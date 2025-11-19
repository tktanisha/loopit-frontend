import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';

import { SocietyPayload } from '../../models/society';
import { GetCategoryResponse } from '../../models/category';
import { User } from '../../models/user';

import { SocietyService } from '../../service/society.service';
import { CategoryService } from '../../service/category.service';
import { UserService } from '../../service/user-service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [Toast],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  providers: [MessageService],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  societyService = inject(SocietyService);
  categoryService = inject(CategoryService);
  userService = inject(UserService);
  messageService = inject(MessageService);
  router = inject(Router);

  societySub!: Subscription;
  categorySub!: Subscription;
  userSub!: Subscription;
  lenderSub!: Subscription;

  isLoading = false;

  selectedRole!: any;
  GetAllSocieties: SocietyPayload[] = [];
  GetAllCategories: GetCategoryResponse[] = [];
  GetAllUsers: User[] = [];
  GetAllLenders: User[] = [];

  ngOnInit(): void {
    this.fetchAllCategories();
    this.fetchAllLenders();
    this.fetchAllSocieties();
    this.fetchAllUsers();
  }

  navigateTo(path: string, role?: string) {
    if (role) {
      this.router.navigate([`/dashboard/${path}`], { queryParams: { role } });
    } else {
      this.router.navigate([`/dashboard/${path}`]);
    }
  }

  fetchAllSocieties() {
    this.societySub = this.societyService.fetchAllSociety().subscribe({
      next: (res: any) => (this.GetAllSocieties = res.societies || []),
      error: err => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch societies',
          life: 3000,
        });
      },
    });
  }

  fetchAllCategories() {
    this.categorySub = this.categoryService.getAllCategory().subscribe({
      next: (res: any) => (this.GetAllCategories = res.categories || []),
      error: err => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch categories',
          life: 3000,
        });
      },
    });
  }

  fetchAllUsers() {
    this.isLoading = true;
    this.userSub = this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.GetAllUsers = res.users || [];
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch users',
          life: 3000,
        });
      },
    });
  }

  fetchAllLenders() {
    this.isLoading = true;
    const params = { role: 'lender' };

    this.lenderSub = this.userService.getAllUsers(params).subscribe({
      next: (res: any) => {
        this.GetAllLenders = res.users || [];
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch lenders',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.societySub?.unsubscribe();
    this.categorySub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.lenderSub?.unsubscribe();
  }
}
