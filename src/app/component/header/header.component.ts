import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/auth.service';
import { LoggedInUser } from '../../models/logged-in-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // for login component display
  isUserLoggedIn: boolean = false;

  @Input() isSidebarOpen: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  userService: UserService = inject(UserService);
  private userSubject!: Subscription;

  ngOnInit(): void {
    this.userSubject = this.userService.user.subscribe((user: LoggedInUser | null) => {
      this.isUserLoggedIn = user ? true : false;
    });
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