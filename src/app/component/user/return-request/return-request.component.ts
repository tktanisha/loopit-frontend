import { Component ,inject} from '@angular/core';
import { ReturnRequestService } from '../../../service/return-request';
import { ReturnRequestResponse, ReturnStatus } from '../../../models/return-request';
import { LoaderComponent } from '../../loader/loader';
import { ReturnStatusPipe } from '../../../custom-pipes/return-request-pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-return-request',
  imports: [LoaderComponent,ReturnStatusPipe,CommonModule],
  templateUrl: './return-request.component.html',
  styleUrl: './return-request.component.scss'
})
export class ReturnRequestComponent {
  
 returnRequestService = inject (ReturnRequestService)

  isLoading:boolean = false
  allReturnRequests:ReturnRequestResponse[]=[]
  
 
  ngOnInit():void {
    this.getAllRequest()
  }


  getAllRequest(){
    this.isLoading=true
     this.returnRequestService.GetAllReturnRequests()
     .subscribe({
      next:(res:any)=>{
        this.allReturnRequests=res.requests??[]
          console.log("response of all buy requests",this.allReturnRequests)
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
    this.returnRequestService.UpdateReturnRequestStatus(reqId,'Rejected')
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
    this.returnRequestService.UpdateReturnRequestStatus(reqId,'Approved')
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
