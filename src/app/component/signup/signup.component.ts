import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { SignUpRequest } from '../../models/signup';

import { AuthService } from '../../service/auth.service';
import { LoaderComponent } from '../loader/loader';
import { LoginComponent } from '../login/login.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, LoaderComponent, CommonModule, LoginComponent, Toast],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  messageService = inject(MessageService);
  AuthService = inject(AuthService);
  private router = inject(Router);

  @Output() clickEvent = new EventEmitter<void>();

  isLoading: boolean = false;
  isLoggedIn: boolean = false;

  signUpSubject!: Subscription;

  errorMessage!: string | null;

  user: SignUpRequest = {
    fullname: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
  };

  handleOnClose() {
    this.clickEvent.emit();
  }

  onFormSubmitted(form: NgForm) {
    console.log(form);

    if (form.valid) {
      this.sumbitSignUpForm();
    }
    form.reset();
  }

  sumbitSignUpForm() {
    this.isLoading = true;
    this.signUpSubject = this.AuthService.signup(this.user).subscribe({
      next: data => {
        this.AuthService.handleAuthSuccess(data);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.log(err.error.details);
        this.errorMessage = err.error.details;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to sign up, do again! ',
          life: 3000,
        });
      },
    });
  }

  onClickSignIn() {
    this.isLoggedIn = true;
  }

  ngOnDestroy(): void {
    this.signUpSubject.unsubscribe();
  }
}
