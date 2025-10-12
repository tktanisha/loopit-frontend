import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { LoaderComponent } from '../../loader/loader';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserService } from '../../../service/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, LoaderComponent, TableModule, ButtonModule, Toast, ConfirmDialogModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class UserComponent implements OnDestroy {
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  userSub!: Subscription;
  users: User[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers() {
    this.isLoading = true;
    this.userSub = this.userService.getAllUsers().subscribe({
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
    if (this.userSub) this.userSub.unsubscribe();
  }
}
