import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { Toast } from "primeng/toast";

import { ReturnStatusPipe } from "../../../custom-pipes/return-request-pipe";

import {
  ReturnRequestResponse,
  ReturnStatus,
} from "../../../models/return-request";

import { ReturnRequestService } from "../../../service/return-request";
import { LoaderComponent } from "../../loader/loader";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-return-request",
  imports: [
    LoaderComponent,
    ReturnStatusPipe,
    CommonModule,
    Toast,
    TableModule,
    ButtonModule,
  ],
  templateUrl: "./return-request.component.html",
  styleUrl: "./return-request.component.scss",
})
export class ReturnRequestComponent {
  returnRequestService = inject(ReturnRequestService);
  messageService = inject(MessageService);

  allRequestSubject!: Subscription;
  updateRequestSubject!: Subscription;

  isLoading: boolean = false;

  allReturnRequests: ReturnRequestResponse[] = [];

  ngOnInit(): void {
    this.getAllRequest();
  }

  getAllRequest() {
    this.isLoading = true;
    this.allRequestSubject = this.returnRequestService
      .GetAllReturnRequests()
      .subscribe({
        next: (res: any) => {
          this.allReturnRequests = res.requests ?? [];
          console.log("response of all buy requests", this.allReturnRequests);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetched requests.",
          });
        },
      });
  }

  handleReject(reqId: number) {
    this.isLoading = true;
    console.log("request id = ", reqId);
    this.updateRequestSubject = this.returnRequestService
      .UpdateReturnRequestStatus(reqId, "Rejected")
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.isLoading = false;
          this.getAllRequest();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  handleAccept(reqId: number) {
    this.isLoading = true;
    this.allRequestSubject = this.returnRequestService
      .UpdateReturnRequestStatus(reqId, "Approved")
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.isLoading = false;
          this.getAllRequest();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    if (this.updateRequestSubject) this.updateRequestSubject.unsubscribe();
    if (this.allRequestSubject) this.allRequestSubject.unsubscribe();
  }
}
