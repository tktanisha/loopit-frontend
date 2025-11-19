import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';

import { LoggedInUser } from '../../models/logged-in-user';

import { AuthService } from '../../service/auth.service';

import { LoaderComponent } from '../loader/loader';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AuthComponent, CommonModule, LoaderComponent, Toast],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  isLoading: boolean = false;
  showAuthModal: { login: boolean; signup: boolean } = {
    login: false,
    signup: false,
  };

  @Input() isSidebarOpen: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  AuthService: AuthService = inject(AuthService);
  messageService: MessageService = inject(MessageService);
  router: Router = inject(Router);

  private userSubject!: Subscription;

  user!: LoggedInUser | null;

  ngOnInit(): void {
    this.isLoading = true;
    this.userSubject = this.AuthService.user.subscribe((user: LoggedInUser | null) => {
      this.isUserLoggedIn = user ? true : false;
      this.user = user;
    });
    this.isLoading = false;
  }

  onClickedSignIn() {
    this.showAuthModal.login = true;
    this.showAuthModal.signup = false;
  }

  handleLoginClose() {
    this.showAuthModal.login = false;
    this.showAuthModal.signup = false;
  }

  toggelSidebar() {
    this.toggleSidebar.emit();
  }

  handleLogout() {
    this.AuthService.handleLogout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.userSubject.unsubscribe();
  }
}
