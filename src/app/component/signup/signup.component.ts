import { Component, EventEmitter, Output, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Toast } from 'primeng/toast';
import { LoaderComponent } from '../loader/loader';
import { MessageService } from 'primeng/api';

import { SignUpRequest } from '../../models/signup';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [Toast, LoaderComponent, CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnDestroy {
  private messageService = inject(MessageService);
  private AuthService = inject(AuthService);
  private router = inject(Router);

  @Output() switchToLogin = new EventEmitter<void>(); // tell parent to show login
  @Output() closeEvent = new EventEmitter<void>(); // tell parent to close overlay

  isLoading = false;
  signUpSubject?: Subscription;
  errorMessage?: string | null;

  user: SignUpRequest = {
    fullname: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
  };

  handleOnClose() {
    this.closeEvent.emit();
  }

  onFormSubmitted(form: NgForm) {
    if (form.valid) {
      this.submitSignUpForm();
    }
    form.reset();
  }

  submitSignUpForm() {
    this.isLoading = true;
    this.signUpSubject = this.AuthService.signup(this.user).subscribe({
      next: data => {
        this.AuthService.handleAuthSuccess(data);
        this.isLoading = false;
        this.closeEvent.emit();
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.details ?? 'Failed to sign up';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to sign up, try again!',
          life: 3000,
        });
      },
    });
  }

  onClickSignIn() {
    this.switchToLogin.emit();
  }

  ngOnDestroy(): void {
    this.signUpSubject?.unsubscribe();
  }
}
