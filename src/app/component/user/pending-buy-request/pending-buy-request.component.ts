import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { Toast } from "primeng/toast";

import { BuyRequestResponse } from "../../../models/buy-request";
import { LoggedInUser } from "../../../models/logged-in-user";

import { BuyStatusPipe } from "../../../custom-pipes/buy-request-status.pipe";

import { AuthService } from "../../../service/auth.service";
import { BuyRequestService } from "../../../service/buy-request.service";
import { LoaderComponent } from "../../loader/loader";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-buy-request",
  imports: [
    CommonModule,
    LoaderComponent,
    BuyStatusPipe,
    Toast,
    TableModule,
    ButtonModule,
  ],
  templateUrl: "./pending-buy-request.component.html",
  styleUrl: "./pending-buy-request.component.scss",
})
export class PendingBuyRequestComponent {
  BuyRequestService: BuyRequestService = inject(BuyRequestService);
  messageService: MessageService = inject(MessageService);
  AuthService: AuthService = inject(AuthService);

  requestSubject!: Subscription;

  loggedInUser!: LoggedInUser | null;

  allBuyRequests: BuyRequestResponse[] = [];
  BuyRequestOfUser: BuyRequestResponse[] = [];

  isLoading: boolean = false;

  ngOnInit(): void {
    this.loggedInUser = this.AuthService.getUser();
    this.getAllRequest();
  }

  getAllRequest() {
    this.isLoading = true;
    this.BuyRequestService.GetAllRequest().subscribe({
      next: (res: any) => {
        this.allBuyRequests = res.requests ?? [];
        console.log("response of all buy requests", this.allBuyRequests);
        this.BuyRequestOfUser = this.allBuyRequests.filter((res: any) => {
          return res.product.product.lender_id == this.loggedInUser?.user_id;
        });

        this.isLoading = false;
    
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch pending request ",
          life: 3000,
        });
      },
    });
  }

  handleReject(reqId: number) {
    this.isLoading = true;
    console.log("request id = ", reqId);
    this.BuyRequestService.UpdateBuyRequest(reqId, "Rejected").subscribe({
      next: (res: any) => {
        console.log(res);
        this.isLoading = false;
        this.getAllRequest();
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Rejected the Buy Request ",
          life: 5000,
        });
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "failed to reject buy request ",
          life: 3000,
        });
      },
    });
  }

  handleAccept(reqId: number) {
    this.isLoading = true;
    this.BuyRequestService.UpdateBuyRequest(reqId, "Approved").subscribe({
      next: (res: any) => {
        console.log(res);
        this.isLoading = false;
        this.getAllRequest();
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Successfully approved the Buy Request ",
          life: 5000,
        });
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "failed to approve buy request ",
          life: 3000,
        });
      },
    });
  }
}
