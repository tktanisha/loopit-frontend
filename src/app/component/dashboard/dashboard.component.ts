import { BootstrapOptions, Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, CommonModule,RouterOutlet],
  templateUrl:'./dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isSidebarOpen:boolean = true;

  handleToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleCloseSidebar() {
    this.isSidebarOpen = false;
  }
}