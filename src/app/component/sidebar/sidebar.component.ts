import { Component, EventEmitter, Output,inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() closeEvent = new EventEmitter<void>();
  @Input() isOpen:boolean=true;

  router=inject(Router)
  userService=inject(UserService)



  // Navigation links of admin
  menuItemsAdmin = [
    { label: 'Home', icon: 'pi pi-home', route: 'home' },
    { label: 'Approve Lender', icon: 'pi pi-users', route: 'approve-lender', badge: 3 },
    { label: 'Create Category', icon: 'pi pi-plus', route: 'create-category' },
    { label: 'Get Categories', icon: 'pi pi-list', route: 'all-categories' },
    { label: 'Create Society', icon: 'pi pi-plus', route: 'create-society' },
    { label: 'Get Societies', icon: 'pi pi-building', route: 'all-societies' },
  ];

    menuItemsUser = [
    { label: 'Browse Items', icon: 'pi pi-search', route: 'all-products' },
    { label: 'My Requests', icon: 'pi pi-shopping-cart', route: 'all-requests', badge: 3 },
    { label: 'My Rentals', icon: 'pi pi-box', route: 'all-rentals' },
    { label: 'Return Requests', icon: 'pi pi-check-circle', route: 'return-request' },
   //pi-user-plus--become lender
  ];

  menuItemsLender=[

  ]


  closeSidebar() {
    this.closeEvent.emit();
  }
  handleLogout(){
    this.userService.logout()
      this.router.navigate(['/']);
  }
}