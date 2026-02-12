import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocietyPayload } from '../models/society';
import { map } from 'rxjs/internal/operators/map';
import { GetSocietyResponse } from '../models/society';

@Injectable({
  providedIn: 'root',
})
export class SocietyService {
  private ApiUrl = 'http://loopit-backend-242104569.ap-south-1.elb.amazonaws.com';
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  createSociety(data: SocietyPayload) {
    return this.http.post<SocietyPayload>(`${this.ApiUrl}/societies`, data);
  }

fetchAllSociety() {
  return this.http
    .get<{ status: boolean; data: GetSocietyResponse[] }>(`${this.ApiUrl}/societies`)
    .pipe(map(res => res.data));
}
  updateSociety(id: string, data: SocietyPayload) {
    return this.http.put(`${this.ApiUrl}/societies/${id}`, data);
  }

  deleteSociety(id: string) {
    return this.http.delete(`${this.ApiUrl}/societies/${id}`);
  }
}
