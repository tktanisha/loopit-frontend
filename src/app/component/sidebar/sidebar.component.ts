import { Component, EventEmitter, Output,inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LoggedInUser } from '../../models/logged-in-user';
import { Subscription } from 'rxjs';
import { Role } from '../../models/user';
import { UserService } from '../../service/user-service';
import { LoaderComponent } from '../loader/loader';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive,LoaderComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<void>();
  @Input() isOpen:boolean=true;

  router=inject(Router)
  AuthService=inject(AuthService)
  userService=inject(UserService)
  userSubject!:Subscription
  loggedInUser!:LoggedInUser | null;
  currentMenuItems: any[] = []; 
  loggedInUserRole:string=''
  isLoading:boolean=false

  ngOnInit(): void {
    this.userSubject = this.AuthService.user.subscribe((user:LoggedInUser| null)=>{
      this.loggedInUser = user?user:null;
      if (this.loggedInUser) {
        this.loggedInUserRole=this.loggedInUser.role
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
    // { label: 'Approve Lender', icon: 'pi pi-users', route: 'approve-lender', badge: 3 },
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

  menuItemsLender=[
    { label: 'Browse Items', icon: 'pi pi-search', route: 'all-products' },
    { label: 'My Buy Requests', icon: 'pi pi-shopping-cart', route: 'buy-requests', badge: 2 },
    { label: 'My Orders', icon: 'pi pi-search', route: 'orders/history' },
    { label: 'Create Products', icon: 'pi pi-plus', route: 'create-products' },
    { label: 'Pending Buy Requests', icon: 'pi pi-shopping-cart', route: 'all-pending-buy-requests', badge: 3 },
    { label: 'my Lending history', icon: 'pi pi-box', route: 'orders/lender/history' },
    { label: 'Approved Awaiting Orders', icon: 'pi pi-box', route: 'orders/approved-awaiting' },
    { label: 'Recieved Feedback', icon: 'pi pi-box', route: 'recieved-feedback' },


    
  ]

  closeSidebar() {
    this.closeEvent.emit();
  }

  handleBecomeLender(){
    this.isLoading=true
    this.userService.BecomeLender()
    .subscribe({
      next:(data)=>{
        console.log(data)
        this.isLoading=false
        this.AuthService.logout()

      },
      error:(err)=>{
        console.log(err)
        this.isLoading=false
      }
    })
  }
  handleLogout(){
    this.AuthService.logout()
    this.router.navigate(['/']);
  }
}
