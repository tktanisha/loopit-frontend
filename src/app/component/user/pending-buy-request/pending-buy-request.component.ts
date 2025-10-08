import { Component ,inject} from '@angular/core';
import { BuyRequestService } from '../../../service/buy-request.service';
import { BuyRequestResponse } from '../../../models/buy-request';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader';
import { BuyStatusPipe } from '../../../custom-pipes/buy-request-status.pipe';
import { AuthService } from '../../../service/auth.service';
import { LoggedInUser } from '../../../models/logged-in-user';


@Component({
  selector: 'app-buy-request',
  imports: [CommonModule,LoaderComponent,BuyStatusPipe],
  templateUrl: './pending-buy-request.component.html',
  styleUrl: './pending-buy-request.component.scss'
})
export class PendingBuyRequestComponent {
  
  BuyRequestService:BuyRequestService = inject(BuyRequestService)
  AuthService : AuthService = inject(AuthService)

  loggedInUser:LoggedInUser | null = this.AuthService.getUser()
  isLoading:boolean = false
  allBuyRequests:BuyRequestResponse[]=[]
  BuyRequestOfUser:BuyRequestResponse[]=[]
 


  ngOnInit():void {
    this.getAllRequest()
  }


  getAllRequest(){
    this.isLoading=true
     this.BuyRequestService.GetAllRequest('Pending')
     .subscribe({
      next:(res:any)=>{
        this.allBuyRequests=res.requests??[]
          console.log("response of all buy requests",this.allBuyRequests)
        this.BuyRequestOfUser = this.allBuyRequests.filter((res:any)=>{
          return res.product.product.lender_id == this.loggedInUser?.user_id
        })
        console.log(" for request fro lender=",this.BuyRequestOfUser)
      
        this.isLoading = false
      },
      error:(err)=>{
        console.log(err)
        this.isLoading = false
      }
     })
  }

  handleReject(reqId:number){
    this.isLoading = true
    console.log("request id = ",reqId)
    this.BuyRequestService.UpdateBuyRequest(reqId,'Rejected')
    .subscribe({
       next:(res:any)=>{
        console.log(res)
        this.isLoading=false
        this.getAllRequest()
        },
      error:(err)=>{
        console.log(err)
        this.isLoading = false
      }
    })
  }

  handleAccept(reqId:number){
    this.isLoading = true
    this.BuyRequestService.UpdateBuyRequest(reqId,'Approved')
    .subscribe({
       next:(res:any)=>{
        console.log(res)
        this.isLoading=false
        this.getAllRequest()
        },
      error:(err)=>{
        console.log(err)
        this.isLoading = false
      }
    })
  }
  
}
