import { Component, inject } from '@angular/core';
import { OrderService } from '../../../service/orders.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { OrderResponse } from '../../../models/orders';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader';
import { OrderStatusPipe } from '../../../custom-pipes/order-status-pipe';
import { LoggedInUser } from '../../../models/logged-in-user';
import { FeedbackService } from '../../../service/feedback.service';
import { FeedbackRequest } from '../../../models/feedback';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    LoaderComponent,
    OrderStatusPipe,
    FormsModule,
    DialogModule,
    RatingModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    Toast,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  feedbackService = inject(FeedbackService);
  messageService = inject(MessageService);

  router = inject(Router);

  orderSubject!: Subscription;
  feedbackSubject!: Subscription;

  AllOrders: OrderResponse[] = [];

  isLoading: boolean = false;
  displayFeedbackDialog: boolean = false;

  loggedInUser!: LoggedInUser | null;
  currentOrderId!: number;

  feedbackData = {
    rating: 0,
    description: '',
  };

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
    this.GetOrders();
  }

  showFeedbackDialog(orderId: number): void {
    this.currentOrderId = orderId;
    this.displayFeedbackDialog = true;
    this.feedbackData = { rating: 0, description: '' };
  }

  submitFeedback(): void {
    const request: FeedbackRequest = {
      order_id: this.currentOrderId,
      rating: this.feedbackData.rating,
      feedback_text: this.feedbackData.description,
    };

    if (!request.rating) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please provide a rating.',
      });
      return;
    }

    this.isLoading = true;
    this.feedbackSubject = this.feedbackService.GiveFeedback(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.displayFeedbackDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Feedback submitted successfully!',
        });
      },
      error: err => {
        console.error('Error submitting feedback:', err);
        this.isLoading = false;
        this.displayFeedbackDialog = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to submit feedback.',
        });
      },
    });
  }

  GetOrders(): void {
    this.isLoading = true;
    this.orderSubject = this.orderService.GetOrderHistory().subscribe({
      next: (data: any) => {
        if (data && data.orders) {
          this.AllOrders = data.orders;
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching order history:', err);
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.orderSubject.unsubscribe();
    this.feedbackSubject.unsubscribe();
  }
}
