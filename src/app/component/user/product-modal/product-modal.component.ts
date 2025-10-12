import { Component, EventEmitter,Input,Output,inject } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';

import { BuyRequestPayload } from '../../../models/buy-request';
import { ProductResponse } from '../../../models/product';

import { BuyRequestService } from '../../../service/buy-request.service';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-product-modal',
  imports: [LoaderComponent,Toast],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent {

@Output() closeEvent = new EventEmitter<void>()
@Input() product!:ProductResponse

BuyRequestService: BuyRequestService = inject(BuyRequestService)
messageService: MessageService = inject(MessageService)

requestSubject!:Subscription

isLoading:boolean = false

handleOnClose(){
  console.log("handle on close")
  this.closeEvent.emit()
}


handleBuyRequest(productId: number | null){
  console.log("clcik on create buy request")
  if (productId === null) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Cannot create buy request: Product ID is null',
    })
    return;
  }

  this.isLoading = true;

  const payload: BuyRequestPayload = { product_id: productId }; 
  console.log("payload",payload)

  this.requestSubject = this.BuyRequestService.createRequest(payload)
  .subscribe({
    next:(response:any)=>{
      console.log(response);
      this.isLoading = false;
      this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Buy request created successfully!',
        });
      this.closeEvent.emit()
    },
    error:(err:Error)=>{
      console.log(err);
      this.isLoading = false;
       this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create buy request',
        });
    }
  });
}

 ngOnDestroy():void {
  if(this.requestSubject)this.requestSubject.unsubscribe()
 }
}
