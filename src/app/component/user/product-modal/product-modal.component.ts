import { Component, EventEmitter,Input,Output,inject } from '@angular/core';
import { ProductResponse } from '../../../models/product';
import { BuyRequestService } from '../../../service/buy-request.service';
import { BuyRequestPayload } from '../../../models/buy-request';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-product-modal',
  imports: [LoaderComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent {

@Output() closeEvent = new EventEmitter<void>()
@Input() product!:ProductResponse
BuyRequestService: BuyRequestService = inject(BuyRequestService)
isLoading:boolean = false

handleOnClose(){
  console.log("handle on close")
  this.closeEvent.emit()
}


handleBuyRequest(productId: number | null){
  console.log("clcik on create buy request")
  if (productId === null) {
    console.error('Cannot create buy request: Product ID is null');
    return;
  }

  this.isLoading = true;

  const payload: BuyRequestPayload = { product_id: productId }; 
  console.log("payload",payload)

  this.BuyRequestService.createRequest(payload)
  .subscribe({
    next:(response:any)=>{
      console.log(response);
      this.isLoading = false;
    },
    error:(err:Error)=>{
      console.log(err);
      this.isLoading = false;
    }
  });
}}
