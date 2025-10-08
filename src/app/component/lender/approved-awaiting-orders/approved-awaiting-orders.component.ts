import { Component,inject } from '@angular/core';
import { OrderService } from '../../../service/orders.service';
import { OrderStatusPipe } from '../../../custom-pipes/order-status-pipe';
import { LoaderComponent } from '../../loader/loader';
import { Order, OrderResponse } from '../../../models/orders';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-approved-awaiting-orders',
  imports: [OrderStatusPipe,LoaderComponent,CommonModule],
  templateUrl: './approved-awaiting-orders.component.html',
  styleUrl: './approved-awaiting-orders.component.scss'
})
export class ApprovedAwaitingOrdersComponent {

  isLoading:boolean=false
  orderService= inject(OrderService)
  AllOrders:OrderResponse[]=[]

  ngOnInit():void {
    this.getAllApprovedAwaitingOrders()
  }
   
  getAllApprovedAwaitingOrders(){
     this.isLoading=true
    this.orderService.GetAllApprovedAwaitingOrders()
     .subscribe({
      next:(data:any)=>{
        console.log(data)
          if (data && data.orders) {
          this.AllOrders = data.orders;
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
      },
      error:(err)=>{
        console.log(err)
        this.isLoading=false
      }
    })
  }
  markOrderAsReturn(order_id:number){
    this.isLoading=true
    this.orderService.MarkOrderAsReturned(order_id)
     .subscribe({
      next:(data:any)=>{
        console.log(data)
          if (data && data.orders) {
          this.getAllApprovedAwaitingOrders()
        } else {
          this.AllOrders = [];
        }
        this.isLoading = false;
      },
      error:(err)=>{
        console.log(err)
        this.isLoading=false
      }
    })
  }
}
