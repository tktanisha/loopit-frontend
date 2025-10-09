import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../service/orders.service';
import { Toast } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

import { OrderStatusPipe } from '../../../custom-pipes/order-status-pipe';

import { LoaderComponent } from '../../loader/loader';
import { OrderResponse } from '../../../models/orders';

@Component({
  selector: 'app-approved-awaiting-orders',
  imports: [OrderStatusPipe, LoaderComponent, CommonModule, Toast],
  templateUrl: './approved-awaiting-orders.component.html',
  styleUrl: './approved-awaiting-orders.component.scss',
})
export class ApprovedAwaitingOrdersComponent {
  orderService = inject(OrderService);
  messageService = inject(MessageService);

  approvedAwaitingorderSubject!: Subscription;
  markOrderReturnedSubject!: Subscription;

  isLoading: boolean = false;

  AllOrders: OrderResponse[] = [];

  ngOnInit(): void {
    this.getAllApprovedAwaitingOrders();
  }

  getAllApprovedAwaitingOrders() {
    this.isLoading = true;
    this.approvedAwaitingorderSubject = this.orderService.GetAllApprovedAwaitingOrders().subscribe({
      next: (data: any) => {
        console.log(data);
        if (data && data.orders) {
          this.AllOrders = data.orders;
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully fetched all orders to mark as return  ',
          life: 3000,
        });
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to fetch orders ',
          life: 3000,
        });
      },
    });
  }
  markOrderAsReturn(order_id: number) {
    this.isLoading = true;
    this.markOrderReturnedSubject = this.orderService.MarkOrderAsReturned(order_id).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data && data.orders) {
          this.getAllApprovedAwaitingOrders();
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
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: 'Failed to return orders ',
          life: 3000,
        });
      },
    });
  }
}
