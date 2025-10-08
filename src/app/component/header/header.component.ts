import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { LoggedInUser } from '../../models/logged-in-user';
import { Subscription } from 'rxjs';
import { LoaderComponent } from '../loader/loader';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginComponent, CommonModule,LoaderComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // for login component display
  isUserLoggedIn: boolean = false;
  isLoading:boolean=false
  @Input() isSidebarOpen: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  AuthService: AuthService = inject(AuthService);
  private userSubject!: Subscription;

  ngOnInit(): void {
    this.isLoading=true
    this.userSubject = this.AuthService.user.subscribe((user: LoggedInUser | null) => {
      this.isUserLoggedIn = user ? true : false;
    });
    this.isLoading=false
  }

  onClickedSignIn() {
    this.isLoggedIn = true;
  }

  handleLoginClose() {
    this.isLoggedIn = false;
  }

  toggelSidebar() {
    this.toggleSidebar.emit();
  }

  ngOnDestroy() {
    this.userSubject.unsubscribe();
  }
}