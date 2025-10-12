import { Component, EventEmitter, Output, Input } from '@angular/core';
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
export class AuthComponent {
  showLogin = true;
  @Input() isLogin = false;
  @Output() closeEvent = new EventEmitter<void>();

  onSwitchToSignup() {
    this.showLogin = false;
  }

  onSwitchToLogin() {
    this.showLogin = true;
  }

  onChildClose() {
    this.closeEvent.emit();
  }
}
