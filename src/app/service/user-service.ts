import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ApiUrl = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v1';
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  BecomeLender() {
    return this.http.patch(`${this.ApiUrl}/users/become-lender`, {});
  }

  getAllUsers(params?: any) {
    let query = '';
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      query = `?${queryParams}`;
    }
    return this.http.get<{ users: User[] }>(`${this.ApiUrl}/users${query}`);
  }

  getUserById(id: number) {
    return this.http.get<{ user: User }>(`${this.ApiUrl}/users/${id}`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.ApiUrl}/users/${id}`);
  }
}
