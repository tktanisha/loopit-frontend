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
          case 'lender':
            this.currentMenuItems = this.menuItemsLender;
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
    { label: 'Create Category', icon: 'pi pi-plus', route: 'create-category' },
    { label: 'Get Categories', icon: 'pi pi-list', route: 'all-categories' },
    { label: 'Create Society', icon: 'pi pi-plus', route: 'create-society' },
    { label: 'Get Societies', icon: 'pi pi-building', route: 'all-societies' },
  ];

  menuItemsUser = [
    { label: 'Browse Items', icon: 'pi pi-search', route: 'all-products' },
    { label: 'My Buy Requests', icon: 'pi pi-shopping-cart', route: 'buy-requests', badge: 3 },
    { label: 'My Orders', icon: 'pi pi-box', route: 'all-rentals' },
    { label: 'All Return Requests', icon: 'pi pi-check-circle', route: 'return-requests' },
    { label: 'All Given Feedback', icon: 'pi pi-check-circle', route: 'given-feedback' },
  ];

  menuItemsLender = [
    { label: 'Browse Items', icon: 'pi pi-search', route: 'all-products' },
    { label: 'My Buy Requests', icon: 'pi pi-shopping-cart', route: 'buy-requests', badge: 2 },
    { label: 'My Orders', icon: 'pi pi-search', route: 'orders/history' },
    { label: 'Create Products', icon: 'pi pi-plus', route: 'create-products' },
    {
      label: 'Pending Buy Requests',
      icon: 'pi pi-shopping-cart',
      route: 'all-pending-buy-requests',
      badge: 3,
    },
    { label: 'my Lending history', icon: 'pi pi-box', route: 'orders/lender/history' },
    { label: 'Approved Awaiting Orders', icon: 'pi pi-box', route: 'orders/approved-awaiting' },
    { label: 'Recieved Feedback', icon: 'pi pi-box', route: 'recieved-feedback' },
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
          detail: 'You are now a lender, please login again!',
          life: 4000,
        });
        this.AuthService.logout();
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Unable to become lender ',
          life: 3000,
        });
      },
    });
  }
  handleLogout() {
    this.AuthService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.userSubject.unsubscribe();
    this.lenderSubject.unsubscribe();
  }
}
