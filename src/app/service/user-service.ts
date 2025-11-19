import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ApiUrl = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v3';
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
    return this.http
      .get<{ data: { users: User[] } }>(`${this.ApiUrl}/users${query}`)
      .pipe(map(res => res.data.users));
  }

  getUserById(id: number) {
    return this.http
      .get<{ data: { user: User } }>(`${this.ApiUrl}/users/${id}`)
      .pipe(map(res => res.data.user));
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.ApiUrl}/users/${id}`);
  }
}
