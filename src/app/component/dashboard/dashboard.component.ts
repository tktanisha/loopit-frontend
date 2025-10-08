import { inject, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, CommonModule,RouterOutlet],
  templateUrl:'./dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isSidebarOpen:boolean = true;
  authService = inject(AuthService);
  router = inject(Router);

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