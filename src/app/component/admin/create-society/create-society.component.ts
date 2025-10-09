import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { SocietyPayload } from '../../../models/society';

import { LoaderComponent } from '../../loader/loader';
import { SocietyService } from '../../../service/society.service';

@Component({
  selector: 'app-create-society',
  imports: [FormsModule, CommonModule, LoaderComponent, Toast],
  templateUrl: './create-society.component.html',
  styleUrl: './create-society.component.scss',
  providers: [MessageService],
})
export class CreateSocietyComponent {
  societyService = inject(SocietyService);
  messageService = inject(MessageService);

  societySubject!: Subscription;

  getSocieties: SocietyPayload[] = [];

  isLoading: boolean = false;

  society: SocietyPayload = {
    name: '',
    location: '',
    pincode: '',
  };

  onSubmitSociety(form: NgForm) {
    if (form.valid) {
      this.createSociety(this.society);
      form.reset();
    }
  }

  createSociety(society: SocietyPayload) {
    this.isLoading = true;
    this.societySubject = this.societyService.createSociety(society).subscribe({
      next: res => {
        console.log(res);
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Society added successfully',
          life: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to add society',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy() {
    this.societySubject.unsubscribe();
  }
}
