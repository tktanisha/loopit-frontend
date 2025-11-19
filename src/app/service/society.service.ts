import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocietyPayload } from '../models/society';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class SocietyService {
  private ApiUrl = 'https://ybfvidgjik.execute-api.ap-south-1.amazonaws.com/v3';
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  createSociety(data: SocietyPayload) {
    return this.http.post<SocietyPayload>(`${this.ApiUrl}/societies/`, data);
  }

  fetchAllSociety() {
    return this.http
      .get<{ data: SocietyPayload[] }>(`${this.ApiUrl}/societies/`)
      .pipe(map(res => res.data));
  }
  updateSociety(id: number, data: SocietyPayload) {
    return this.http.put(`${this.ApiUrl}/societies/${id}`, data);
  }

  deleteSociety(id: number) {
    return this.http.delete(`${this.ApiUrl}/societies/${id}`);
  }
}
