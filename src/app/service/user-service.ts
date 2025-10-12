import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ApiUrl = 'http://localhost:8080';
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  BecomeLender() {
    return this.http.patch(`${this.ApiUrl}/users/become-lender`, {});
  }

  getAllUsers() {
    return this.http.get<{ users: User[] }>(`${this.ApiUrl}/users`);
  }

  getUserById(id: number) {
    return this.http.get<{ user: User }>(`${this.ApiUrl}/users/${id}`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.ApiUrl}/users/${id}`);
  }
}
