import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { Toast } from 'primeng/toast';

import { LoginRequest } from '../../models/login';

import { AuthService } from '../../service/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { LoaderComponent } from '../loader/loader';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, LoaderComponent, DialogModule, SignupComponent, Toast],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private router = inject(Router);
  private AuthService = inject(AuthService);
  private messageService = inject(MessageService);

  @Output() switchToSignup = new EventEmitter<void>();
  @Output() closeEvent = new EventEmitter<void>();
  @Input() isLoggedIn!: boolean;

  isLoading: boolean = false;
  showPassword: boolean = false;

  user: LoginRequest = {
    email: '',
    password: '',
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFormSubmitted(form: NgForm) {
    console.log(form);

    if (form.valid) {
      this.callLoginService();
      this.closeEvent.emit();
    }
    form.reset();
  }

  onCloseAuthForm() {
    this.closeEvent.emit();
    this.router.navigate(['/']);
  }

  callLoginService() {
    this.isLoading = true;
    this.AuthService.login(this.user).subscribe({
      next: data => {
        this.AuthService.handleAuthSuccess(data);
        this.isLoading = false;
       
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Logged in failed ',
          life: 3000,
        });
      },
    });
  }

  onSwitchToSignup() {
    this.switchToSignup.emit();
  }
}
