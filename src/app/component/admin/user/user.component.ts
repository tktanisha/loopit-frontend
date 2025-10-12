// // import { Component, inject, OnDestroy } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { MessageService, ConfirmationService } from 'primeng/api';
// // import { Toast } from 'primeng/toast';
// // import { TableModule } from 'primeng/table';
// // import { ButtonModule } from 'primeng/button';
// // import { Subscription } from 'rxjs';
// // import { LoaderComponent } from '../../loader/loader';
// // import { ConfirmDialogModule } from 'primeng/confirmdialog';
// // import { UserService } from '../../../service/user-service';
// // import { User } from '../../../models/user';

// // @Component({
// //   selector: 'app-user',
// //   standalone: true,
// //   imports: [CommonModule, LoaderComponent, TableModule, ButtonModule, Toast, ConfirmDialogModule],
// //   templateUrl: './user.component.html',
// //   styleUrls: ['./user.component.scss'],
// //   providers: [MessageService, ConfirmationService],
// // })
// // export class UserComponent implements OnDestroy {
// //   private userService = inject(UserService);
// //   private confirmationService = inject(ConfirmationService);
// //   messageService = inject(MessageService);

// //   userSub!: Subscription;
// //   users: User[] = [];
// //   isLoading = false;

// //   ngOnInit(): void {
// //     this.fetchAllUsers();
// //   }

// //   fetchAllUsers() {
// //     this.isLoading = true;
// //     this.userSub = this.userService.getAllUsers().subscribe({
// //       next: (res: any) => {
// //         this.users = res.users || [];
// //         this.isLoading = false;
// //       },
// //       error: err => {
// //         console.error(err);
// //         this.isLoading = false;
// //         this.messageService.add({
// //           severity: 'error',
// //           summary: 'Error',
// //           detail: 'Failed to fetch users',
// //           life: 3000,
// //         });
// //       },
// //     });
// //   }

// //   viewUser(user: User) {
// //     this.messageService.add({
// //       severity: 'info',
// //       summary: 'User Info',
// //       detail: `${user.full_name} (${user.email})`,
// //       life: 3000,
// //     });
// //   }

// //   confirmDeleteUser(user: User): void {
// //     this.confirmationService.confirm({
// //       message: `Are you sure you want to delete user "${user.full_name}"?`,
// //       header: 'Confirm Delete',
// //       icon: 'pi pi-exclamation-triangle',
// //       accept: () => this.deleteUser(user.id),
// //     });
// //   }

// //   deleteUser(id: number): void {
// //     this.isLoading = true;
// //     this.userSub = this.userService.deleteUser(id).subscribe({
// //       next: () => {
// //         this.isLoading = false;
// //         this.fetchAllUsers();
// //         this.messageService.add({
// //           severity: 'success',
// //           summary: 'Deleted',
// //           detail: 'User deleted successfully',
// //           life: 3000,
// //         });
// //       },
// //       error: err => {
// //         console.error('Error deleting user:', err);
// //         this.isLoading = false;
// //         this.messageService.add({
// //           severity: 'error',
// //           summary: 'Error',
// //           detail: 'Error deleting user',
// //           life: 3000,
// //         });
// //       },
// //     });
// //   }

// //   ngOnDestroy(): void {
// //     if (this.userSub) this.userSub.unsubscribe();
// //   }
// // }

// //................................
// import { Component, inject, OnDestroy, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MessageService, ConfirmationService } from 'primeng/api';
// import { Toast } from 'primeng/toast';
// import { TableModule } from 'primeng/table';
// import { ButtonModule } from 'primeng/button';
// import { Subscription, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
// import { LoaderComponent } from '../../loader/loader';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { UserService } from '../../../service/user-service';
// import { User } from '../../../models/user';
// import { DropdownModule } from 'primeng/dropdown';
// import { InputTextModule } from 'primeng/inputtext';
// import { FormsModule } from '@angular/forms';
// import { SocietyService } from '../../../service/society.service'; // assume you have this

// @Component({
//   selector: 'app-user',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     LoaderComponent,
//     TableModule,
//     ButtonModule,
//     Toast,
//     ConfirmDialogModule,
//     DropdownModule,
//     InputTextModule,
//   ],
//   templateUrl: './user.component.html',
//   styleUrls: ['./user.component.scss'],
//   providers: [MessageService, ConfirmationService],
// })
// export class UserComponent implements OnInit, OnDestroy {
//   private userService = inject(UserService);
//   private confirmationService = inject(ConfirmationService);
//   private societyService = inject(SocietyService);
//   messageService = inject(MessageService);

//   userSub!: Subscription;
//   societySub!: Subscription;

//   users: User[] = [];
//   societies: any[] = [];
//   roles = [
//     { label: 'All', value: null },
//     { label: 'User', value: 'user' },
//     { label: 'Lender', value: 'lender' },
//     { label: 'Admin', value: 'admin' },
//   ];

//   isLoading = false;

//   // filters
//   searchTerm = '';
//   selectedSocietyId: number | null = null;
//   selectedRole: string | null = null;

//   private searchSubject = new Subject<string>();

//   ngOnInit(): void {
//     this.fetchAllUsers();
//     this.fetchAllSocieties();

//     // debounce for search
//     this.searchSubject
//       .pipe(debounceTime(500), distinctUntilChanged())
//       .subscribe(() => this.fetchAllUsers());
//   }

//   fetchAllUsers() {
//     this.isLoading = true;

//     const params: any = {};
//     if (this.searchTerm) params.search = this.searchTerm;
//     if (this.selectedSocietyId) params.society_id = this.selectedSocietyId;
//     if (this.selectedRole) params.role = this.selectedRole;

//     this.userSub = this.userService.getAllUsers(params).subscribe({
//       next: (res: any) => {
//         this.users = res.users || [];
//         this.isLoading = false;
//       },
//       error: err => {
//         console.error(err);
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to fetch users',
//           life: 3000,
//         });
//       },
//     });
//   }

//   fetchAllSocieties() {
//     this.societySub = this.societyService.fetchAllSociety().subscribe({
//       next: (res: any) => {
//         this.societies = res.societies || [];
//       },
//       error: err => console.error('Error fetching societies:', err),
//     });
//   }

//   onSearchChange(value: string) {
//     this.searchTerm = value;
//     this.searchSubject.next(value);
//   }

//   applyFilters() {
//     this.fetchAllUsers();
//   }

//   clearFilters() {
//     this.searchTerm = '';
//     this.selectedSocietyId = null;
//     this.selectedRole = null;
//     this.fetchAllUsers();
//   }

//   // delete + view methods unchanged
//   viewUser(user: User) {
//     this.messageService.add({
//       severity: 'info',
//       summary: 'User Info',
//       detail: `${user.full_name} (${user.email})`,
//       life: 3000,
//     });
//   }

//   confirmDeleteUser(user: User): void {
//     this.confirmationService.confirm({
//       message: `Are you sure you want to delete user "${user.full_name}"?`,
//       header: 'Confirm Delete',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => this.deleteUser(user.id),
//     });
//   }

//   deleteUser(id: number): void {
//     this.isLoading = true;
//     this.userSub = this.userService.deleteUser(id).subscribe({
//       next: () => {
//         this.isLoading = false;
//         this.fetchAllUsers();
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Deleted',
//           detail: 'User deleted successfully',
//           life: 3000,
//         });
//       },
//       error: err => {
//         console.error('Error deleting user:', err);
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Error deleting user',
//           life: 3000,
//         });
//       },
//     });
//   }

//   ngOnDestroy(): void {
//     this.userSub?.unsubscribe();
//     this.societySub?.unsubscribe();
//     this.searchSubject.complete();
//   }
// }

//.........................
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Subscription, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LoaderComponent } from '../../loader/loader';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserService } from '../../../service/user-service';
import { User } from '../../../models/user';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SocietyService } from '../../../service/society.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    TableModule,
    ButtonModule,
    Toast,
    ConfirmDialogModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class UserComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private societyService = inject(SocietyService);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute
  messageService = inject(MessageService);

  userSub!: Subscription;
  societySub!: Subscription;
  queryParamsSub!: Subscription; // Subscription to handle query parameter changes

  users: User[] = [];
  societies: any[] = [];
  roles = [
    { label: 'All', value: null },
    { label: 'User', value: 'user' },
    { label: 'Lender', value: 'lender' },
    { label: 'Admin', value: 'admin' },
  ];

  isLoading = false;

  // filters
  searchTerm = '';
  selectedSocietyId: number | null = null;
  selectedRole: string | null = null;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.selectedRole = params['role'];
      } else {
        this.selectedRole = null;
      }
      this.fetchAllUsers();
    });

    this.fetchAllSocieties();

    // debounce for search
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.fetchAllUsers());
  }

  fetchAllUsers() {
    this.isLoading = true;

    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedSocietyId) params.society_id = this.selectedSocietyId;
    if (this.selectedRole) params.role = this.selectedRole;

    this.userSub = this.userService.getAllUsers(params).subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch users',
          life: 3000,
        });
      },
    });
  }

  fetchAllSocieties() {
    this.societySub = this.societyService.fetchAllSociety().subscribe({
      next: (res: any) => {
        this.societies = res.societies || [];
      },
      error: err => console.error('Error fetching societies:', err),
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  applyFilters() {
    this.fetchAllUsers();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSocietyId = null;
    this.selectedRole = null;
    this.fetchAllUsers();
  }

  // delete + view methods unchanged
  viewUser(user: User) {
    this.messageService.add({
      severity: 'info',
      summary: 'User Info',
      detail: `${user.full_name} (${user.email})`,
      life: 3000,
    });
  }

  confirmDeleteUser(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${user.full_name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteUser(user.id),
    });
  }

  deleteUser(id: number): void {
    this.isLoading = true;
    this.userSub = this.userService.deleteUser(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.fetchAllUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'User deleted successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error deleting user:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting user',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.societySub?.unsubscribe();
    this.queryParamsSub?.unsubscribe(); // Unsubscribe from the queryParams observable
    this.searchSubject.complete();
  }
}
