import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../service/orders.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { LoggedInUser } from '../../../models/logged-in-user';
import { OrderResponse } from '../../../models/orders';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from '../../../custom-pipes/order-status-pipe';
import { LoaderComponent } from '../../loader/loader';
import { ReturnRequestService } from '../../../service/return-request';
import { ReturnRequestPayload } from '../../../models/return-request';

@Component({
  selector: 'app-lender-history',
  imports: [CommonModule, OrderStatusPipe, LoaderComponent],
  templateUrl: './lender-history.component.html',
  styleUrl: './lender-history.component.scss'
})
export class LenderHistoryComponent implements OnInit {
  
  orderService = inject(OrderService);
  returnRequestService = inject(ReturnRequestService);
  router = inject(Router);
  authService = inject(AuthService);
  loggesInUser!: LoggedInUser | null;
  AllOrders: OrderResponse[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loggesInUser = this.authService.getUser();
    this.GetOrders();
  }
  
  GetOrders(): void {
    this.isLoading = true;
    this.orderService.GetLenderOrders().subscribe({
      next: (data: any) => {
        if (data && data.orders) {
          this.AllOrders = data.orders;
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching lender orders:', err);
        this.isLoading = false;
      }
    });
  }

  handleCreateReturnRequest(order: any): void {
    const payload: ReturnRequestPayload = { order_id: order.order.id };
    this.isLoading = true;
    this.returnRequestService.CreateReturnRequest(payload).subscribe({
      next: (data: any) => {
        console.log('Return request created successfully:', data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating return request:', err);
        this.isLoading = false;
      }
    });
  }
}
