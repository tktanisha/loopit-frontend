import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { OrderStatusPipe } from '../../../custom-pipes/order-status-pipe';

import { LoggedInUser } from '../../../models/logged-in-user';
import { OrderResponse } from '../../../models/orders';
import { LoaderComponent } from '../../loader/loader';

import { ReturnRequestService } from '../../../service/return-request';
import { OrderService } from '../../../service/orders.service';
import { AuthService } from '../../../service/auth.service';
import { ReturnRequestPayload } from '../../../models/return-request';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lender-history',
  imports: [CommonModule, OrderStatusPipe, LoaderComponent, Toast, TableModule, ButtonModule],
  templateUrl: './lender-history.component.html',
  styleUrl: './lender-history.component.scss',
})
export class LenderHistoryComponent implements OnInit {
  orderService = inject(OrderService);
  returnRequestService = inject(ReturnRequestService);
  messageService = inject(MessageService);
  authService = inject(AuthService);

  router = inject(Router);

  AllOrders: OrderResponse[] = [];

  markOrderReturnedSubject!: Subscription;
  getOrdersSubject!: Subscription;
  createReturnRequestSubject!: Subscription;

  isLoading: boolean = false;

  loggesInUser!: LoggedInUser | null;

  ngOnInit(): void {
    this.loggesInUser = this.authService.getUser();
    this.GetOrders();
  }

  markOrderAsReturn(order_id: number) {
    console.log('ordre id =', order_id);
    this.isLoading = true;
    this.markOrderReturnedSubject = this.orderService.MarkOrderAsReturned(order_id).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data && data.orders) {
          this.GetOrders();
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully mark as return  ',
          life: 3000,
        });
      },
      error: err => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
          life: 3000,
        });
      },
    });
  }

  GetOrders(): void {
    this.isLoading = true;
    this.getOrdersSubject = this.orderService.GetLenderOrders().subscribe({
      next: (data: any) => {
        if (data && data.orders) {
          this.AllOrders = data.orders;
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching lender orders:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.details || err.message || 'Something went wrong',
          life: 3000,
        });
      },
    });
  }

  handleCreateReturnRequest(order: any): void {
    const payload: ReturnRequestPayload = { order_id: order.order.id };
    this.isLoading = true;
    this.createReturnRequestSubject = this.returnRequestService
      .CreateReturnRequest(payload)
      .subscribe({
        next: (data: any) => {
          console.log('Return request created successfully:', data);
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'return request created successfully ',
            life: 3000,
          });
        },
        error: err => {
          console.error('Error creating return request:', err);
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.details || err.message || 'Something went wrong',
            life: 3000,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.createReturnRequestSubject?.unsubscribe;
    this.getOrdersSubject?.unsubscribe();
    this.markOrderReturnedSubject?.unsubscribe();
  }
}
