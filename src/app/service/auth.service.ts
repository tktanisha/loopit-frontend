import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { LoginRequest, LoginResponse } from "../models/login";
import { LoggedInUser } from "../models/logged-in-user";
import { SignUpRequest } from "../models/signup";
import { BehaviorSubject, tap } from "rxjs";

interface DecodedToken {
  exp?: number;
  [key: string]: any;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private ApiUrl = "http://localhost:8080";
  private jwtKey = "auth_token";
  private userkey = "auth_user";

  private http = inject(HttpClient);
  private router = inject(Router);

  user = new BehaviorSubject<LoggedInUser | null>(this.getUser());
  error: string | null = null;

  signup(data: SignUpRequest) {
    return this.http
      .post<LoginResponse>(`${this.ApiUrl}/auth/register`, data)
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  login(data: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.ApiUrl}/auth/login`, data)
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }
  logout() {
    return this.http.post(`${this.ApiUrl}/auth/logout`, {});
  }

  handleAuthSuccess(res: LoginResponse) {
    localStorage.setItem(this.jwtKey, res.token);

    const decodedToken = jwtDecode<DecodedToken>(res.token);
    const expiresIn = decodedToken.exp
      ? new Date(decodedToken.exp * 1000)
      : new Date();

    const userObj = new LoggedInUser(
      res.user.Name,
      res.user.ID,
      res.user.Role,
      expiresIn
    );
    this.user.next(userObj);

    localStorage.setItem(
      this.userkey,
      JSON.stringify({
        ID: res.user.ID,
        Name: res.user.Name,
        Role: res.user.Role,
      })
    );
  }

  handleLogout() {
    localStorage.removeItem(this.jwtKey);
    localStorage.removeItem(this.userkey);
    this.user.next(null);
    this.router.navigate([""]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtKey);
  }

  getUser(): LoggedInUser | null {
    const jsonUser = localStorage.getItem(this.userkey);
    if (jsonUser) {
      const storedUser = JSON.parse(jsonUser);
      const token = this.getToken();
      if (token && !this.isTokenExpired(token)) {
        return new LoggedInUser(
          storedUser.Name,
          storedUser.ID,
          storedUser.Role,
          new Date()
        );
      }
    }

    return null;
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : true;
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem(this.jwtKey)) {
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    if (user?.role == "admin") {
      return true;
    }
    return false;
  }
}
