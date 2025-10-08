import { Component, inject } from '@angular/core';
import { OrderService } from '../../../service/orders.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { OrderResponse } from '../../../models/orders';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader';
import { OrderStatusPipe } from '../../../custom-pipes/order-status-pipe';
import { LoggedInUser } from '../../../models/logged-in-user'; // Ensure this is imported

@Component({
  selector: 'app-orders',
  imports: [CommonModule, LoaderComponent, OrderStatusPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  orderService = inject(OrderService);
  router = inject(Router);
  authService = inject(AuthService);
  loggedInUser!: LoggedInUser | null;
  AllOrders: OrderResponse[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
    this.GetOrders();
  }
  
  GetOrders(): void {
    this.isLoading = true;
    this.orderService.GetOrderHistory()
    .subscribe({
      next: (data: any) => {
        console.log(data);
        if (data && data.orders) {
          this.AllOrders = data.orders;
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching order history:', err);
        this.isLoading = false;
      }
    });
  }
}
