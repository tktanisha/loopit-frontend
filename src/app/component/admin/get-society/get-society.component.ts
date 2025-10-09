import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';

import { SocietyPayload } from '../../../models/society';

import { SocietyService } from '../../../service/society.service';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-get-society',
  imports: [LoaderComponent, CommonModule, Toast],
  templateUrl: './get-society.component.html',
  styleUrl: './get-society.component.scss',
})
export class GetSocietyComponent {
  societyService = inject(SocietyService);
  messageService = inject(MessageService);

  societySubject!: Subscription;

  isLoading: boolean = false;

  GetAllSocieties: SocietyPayload[] = [];

  ngOnInit(): void {
    this.fetchAllSociety();
  }

  fetchAllSociety() {
    this.isLoading = true;
    this.societySubject = this.societyService.fetchAllSociety().subscribe({
      next: (res: any) => {
        this.GetAllSocieties = res.societies;
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully fetched society ',
          life: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to fetch society ',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.societySubject) {
      this.societySubject.unsubscribe();
    }
  }
}
