import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { LoaderComponent } from '../loader/loader';
import { MessageService } from 'primeng/api';

import { LoginRequest } from '../../models/login';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, LoaderComponent, DialogModule, Toast],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private router = inject(Router);
  private AuthService = inject(AuthService);
  private messageService = inject(MessageService);

  @Output() switchToSignup = new EventEmitter<void>();
  @Output() closeEvent = new EventEmitter<void>();

  isLoading = false;
  showPassword = false;

  user: LoginRequest = { email: '', password: '' };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFormSubmitted(form: NgForm) {
    if (form.valid) {
      this.callLoginService();
    }
    form.reset();
  }

  callLoginService() {
    this.isLoading = true;
    this.AuthService.login(this.user).subscribe({
      next: data => {
        this.AuthService.handleAuthSuccess(data);
        this.isLoading = false;
        this.closeEvent.emit(); // After success, ask parent to close
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed',
          life: 3000,
        });
      },
    });
  }

  onClose() {
    this.closeEvent.emit();
  }
}
