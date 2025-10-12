import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocietyPayload } from '../models/society';

@Injectable({
  providedIn: 'root',
})
export class SocietyService {
  private ApiUrl = 'http://localhost:8080';
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  createSociety(data: SocietyPayload) {
    return this.http.post<SocietyPayload>(`${this.ApiUrl}/societies`, data);
  }

  fetchAllSociety() {
    return this.http.get<SocietyPayload[]>(`${this.ApiUrl}/societies`);
  }
}
