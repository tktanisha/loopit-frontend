import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Toast } from 'primeng/toast';

import { BuyStatusPipe } from '../../../custom-pipes/buy-request-status.pipe';

import { BuyRequestResponse } from '../../../models/buy-request';
import { LoggedInUser } from '../../../models/logged-in-user';

import { AuthService } from '../../../service/auth.service';
import { BuyRequestService } from '../../../service/buy-request.service';
import { LoaderComponent } from '../../loader/loader';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-buy-request',
  imports: [CommonModule, LoaderComponent, BuyStatusPipe, Toast, TableModule],
  templateUrl: './buy-request.component.html',
  styleUrl: './buy-request.component.scss',
})
export class GetAllBuyRequestComponent {
  BuyRequestService = inject(BuyRequestService);
  messageService = inject(MessageService);
  AuthService = inject(AuthService);

  requestSubject!: Subscription;

  isLoading: boolean = false;

  allBuyRequests: BuyRequestResponse[] = [];
  BuyRequestOfUser: BuyRequestResponse[] = [];

  loggedInUser!: LoggedInUser | null;

  ngOnInit(): void {
    this.loggedInUser = this.AuthService.getUser();
    this.isLoading = true;
    this.requestSubject = this.BuyRequestService.GetAllRequest().subscribe({
      next: (res: any) => {
        this.allBuyRequests = res.requests;
        if (this.loggedInUser) {
          this.BuyRequestOfUser = this.allBuyRequests?.filter((request: any) => {
            return request.buy_request.requested_by === this.loggedInUser?.user_id;
          });
        }
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch buy request ',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.requestSubject.unsubscribe();
  }
}
