import { Component, EventEmitter, Output, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { LoggedInUser } from '../../models/logged-in-user';

import { AuthService } from '../../service/auth.service';
import { LoaderComponent } from '../loader/loader';
import { UserService } from '../../service/user-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LoaderComponent, Toast],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  messageService = inject(MessageService);
  AuthService = inject(AuthService);
  userService = inject(UserService);

  router = inject(Router);

  userSubject!: Subscription;
  lenderSubject!: Subscription;

  currentMenuItems: any[] = [];

  @Output() closeEvent = new EventEmitter<void>();
  @Input() isOpen: boolean = true;

  isLoading: boolean = false;
  isLenderOpen: boolean = false;

  loggedInUser!: LoggedInUser | null;
  loggedInUserRole: string = '';

  ngOnInit(): void {
    this.userSubject = this.AuthService.user.subscribe((user: LoggedInUser | null) => {
      this.loggedInUser = user ? user : null;
      if (this.loggedInUser) {
        this.loggedInUserRole = this.loggedInUser.role;
        switch (this.loggedInUser.role) {
          case 'admin':
            this.currentMenuItems = this.menuItemsAdmin;
            break;
          default:
            this.currentMenuItems = this.menuItemsUser;
            break;
        }
      }
    });
  }

  menuItemsAdmin = [
    { label: 'Home', icon: 'pi pi-home', route: 'home' },
    { label: 'Categories', icon: 'pi pi-list-check', route: 'categories' },
    { label: 'Societies', icon: 'pi pi-globe', route: 'societies' },
    { label: 'Users', icon: 'pi pi-user', route: 'users' },
  ];

  menuItemsUser = [
    { label: 'Browse Items', icon: 'pi pi-search', route: 'all-products' },
    {
      label: 'My Lend Requests',
      icon: 'pi pi-shopping-cart',
      route: 'lend-requests',
    },
    { label: 'My Orders', icon: 'pi pi-box', route: 'all-orders' },
    {
      label: 'All Return Requests',
      icon: 'pi pi-check-circle',
      route: 'my-return-requests',
    },
  ];

  menuItemsLender = [
    {
      label: 'Manage Products',
      icon: 'pi pi-objects-column',
      route: 'create-products',
    },
    {
      label: 'Lend Requests',
      icon: 'pi pi-cart-arrow-down',
      route: 'all-lend-requests',
    },
    {
      label: 'Orders Received',
      icon: 'pi pi-download',
      route: 'orders/lender/history',
    },
  ];

  closeSidebar() {
    this.closeEvent.emit();
  }

  handleBecomeLender() {
    this.isLoading = true;
    this.lenderSubject = this.userService.BecomeLender().subscribe({
      next: data => {
        console.log(data);
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You are now a lender, now login again!',
          life: 4000,
        });
        this.AuthService.handleLogout();
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to become lender ',
          life: 3000,
        });
      },
    });
  }

  toggleLenderMenu() {
    this.isLenderOpen = !this.isLenderOpen;
  }

  ngOnDestroy(): void {
    if (this.userSubject) this.userSubject.unsubscribe();
    if (this.lenderSubject) this.lenderSubject.unsubscribe();
  }
}
