import { Component ,inject} from '@angular/core';
import { BuyRequestService } from '../../../service/buy-request.service';
import { BuyRequestResponse } from '../../../models/buy-request';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader';
import { BuyStatusPipe } from '../../../custom-pipes/buy-request-status.pipe';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../models/user';
import { LoggedInUser } from '../../../models/logged-in-user';
import { retry } from 'rxjs';

@Component({
  selector: 'app-buy-request',
  imports: [CommonModule,LoaderComponent,BuyStatusPipe],
  templateUrl: './buy-request.component.html',
  styleUrl: './buy-request.component.scss'
})
export class GetAllBuyRequestComponent {
  
  BuyRequestService:BuyRequestService = inject(BuyRequestService)
  AuthService : AuthService = inject(AuthService)

  loggedInUser!:LoggedInUser | null
  isLoading:boolean = false
  allBuyRequests:BuyRequestResponse[]=[]
  BuyRequestOfUser:BuyRequestResponse[]=[]
 
ngOnInit(): void {
  this.loggedInUser =this.AuthService.getUser()
  this.isLoading = true;
  this.BuyRequestService.GetAllRequest().subscribe({
    next: (res: any) => {
      this.allBuyRequests = res.requests;
      if (this.loggedInUser) {
        this.BuyRequestOfUser = this.allBuyRequests.filter((request: any) => {
          return request.buy_request.requested_by === this.loggedInUser?.user_id;
        });
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.log(err);
      this.isLoading = false;
    }
  });
}

  
}
