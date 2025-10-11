import { CommonModule } from '@angular/common';
import { inject, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { AuthService } from '../../service/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, CommonModule, RouterOutlet, Toast, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  messageService = inject(MessageService);
  router = inject(Router);

  isSidebarOpen: boolean = true;

  ngOnInit(): void {
    const user = this.authService.user.getValue();
    if (user) {
      if (user.role === 'admin') {
        this.router.navigate(['/dashboard/home']);
      } else if (user.role === 'lender' || user.role === 'user') {
        this.router.navigate(['/dashboard/all-products']);
      }
    } else {
      // user is not logged in
      this.router.navigate(['/']);
    }
  }

  handleToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleCloseSidebar() {
    this.isSidebarOpen = false;
  }
}
