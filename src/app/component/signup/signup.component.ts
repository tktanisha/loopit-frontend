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
import { GetSocietyResponse } from '../../models/society';
import { SocietyService } from '../../service/society.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [Toast, LoaderComponent, CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnDestroy {
  private messageService = inject(MessageService);
  private societyService = inject(SocietyService);
  private AuthService = inject(AuthService);
  private router = inject(Router);

  @Output() closeEvent = new EventEmitter<void>(); // tell parent to close overlay

  isLoading = false;
  signUpSubject?: Subscription;
  societySubject!: Subscription;
  errorMessage?: string | null;

  allSociety: GetSocietyResponse[] = [];

  user: SignUpRequest = {
    fullname: '',
    email: '',
    password: '',
    phone_number: '',
    society_id: null,
    address: '',
  };

  ngOnInit(): void {
    this.isLoading = true;
    this.societySubject = this.societyService.fetchAllSociety().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allSociety = data.societies;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  onSocietyChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.user.society_id = Number(selectedValue);
  }
  handleOnClose() {
    this.closeEvent.emit();
  }

  onFormSubmitted(form: NgForm) {
    if (form.valid) {
      this.submitSignUpForm();
      form.reset();
    }
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

  ngOnDestroy(): void {
    if (this.signUpSubject) this.signUpSubject.unsubscribe();
    if (this.societySubject) this.signUpSubject?.unsubscribe();
  }
}
