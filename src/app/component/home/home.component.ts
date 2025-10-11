import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { LoggedInUser } from '../../models/logged-in-user';

import { AuthService } from '../../service/auth.service';
import { HeaderComponent } from '../header/header.component';
import { LoaderComponent } from '../loader/loader';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home',
  imports: [SignupComponent, CommonModule, HeaderComponent, LoaderComponent, Toast],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  AuthService = inject(AuthService);
  messageService = inject(MessageService);

  userSubject!: Subscription;
  private router = inject(Router);

  isLoading: boolean = false;
  isSignedUp!: boolean;
  isUserLoggedIn: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.userSubject = this.AuthService.user.subscribe((user: LoggedInUser | null) => {
      this.isUserLoggedIn = user ? true : false;
    });
    this.isLoading = false;
  }

  handleOnClose() {
    this.isSignedUp = false;
    this.router.navigate(['/']);
  }

  onClickChangeToSignupModal() {
    this.isSignedUp = true;
  }

  ngOnDestroy() {
    this.userSubject.unsubscribe();
  }
}
