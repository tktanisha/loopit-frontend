import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  @Input() showAuth: { login: boolean; signup: boolean } = {
    login: false,
    signup: false,
  };
  @Output() closeEvent = new EventEmitter<void>();

  ngOnInit() {
    // Ensure showAuth is properly initialized
    if (!this.showAuth) {
      this.showAuth = {
        login: false,
        signup: false,
      };
    }
  }

  onSwitchToSignup() {
    this.showAuth.login = false;
    this.showAuth.signup = true;
  }

  onSwitchToLogin() {
    this.showAuth.login = true;
    this.showAuth.signup = false;
  }

  onClose() {
    this.showAuth.login = false;
    this.showAuth.signup = false;
    this.closeEvent.emit();
  }

  onChildClose() {
    this.closeEvent.emit();
  }
}
