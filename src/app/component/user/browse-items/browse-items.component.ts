import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Feedback } from '../../../models/feedback';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductResponse } from '../../../models/product';

import { FeedbackService } from '../../../service/feedback.service';
import { LoaderComponent } from '../../loader/loader';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-browse-items',
  imports: [ProductModalComponent, CommonModule, LoaderComponent, Toast],
  templateUrl: './browse-items.component.html',
  styleUrl: './browse-items.component.scss',
})
export class GetAllProductComponent implements OnInit {
  productService = inject(ProductService);
  feedbackService = inject(FeedbackService);
  messageService = inject(MessageService);

  router: Router = inject(Router);
  productSubject!: Subscription;

  isLoading: boolean = false;
  isOpenModal: boolean = false;

  allProduct: ProductResponse[] = [];
  allFeedback: Feedback[] = [];

  selectedProduct!: ProductResponse;

  ngOnInit(): void {
    this.fetchAllProduct();
  }

  fetchAllProduct() {
    this.isLoading = true;
    this.productSubject = this.productService.FetchAllProduct().subscribe({
      next: (products: any) => {
        console.log(products);
        this.allProduct = products.products;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  // fetchAllRecivedFeedback() {
  //   this.feedbackService.GetAllRecievedFeedback().subscribe({
  //     next: (data: any) => {
  //       console.log(data);
  //       this.allFeedback = data.feedbacks;
  //       this.isLoading = false;
  //     },
  //     error: err => {
  //       console.log(err);
  //       this.isLoading = false;
  //     },
  //   });
  // }

  handleOpenModal(product: ProductResponse) {
    this.selectedProduct = product;
    this.isOpenModal = true;
  }

  handleOnClose() {
    this.isOpenModal = false;
  }

  ngOnDestroy(): void {
    this.productSubject.unsubscribe();
  }
}
