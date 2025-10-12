// import { Component, inject, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgForm } from '@angular/forms';

// import { ButtonModule } from 'primeng/button';
// import { MessageService } from 'primeng/api';
// import { Subscription } from 'rxjs';
// import { TableModule } from 'primeng/table';
// import { Toast } from 'primeng/toast';

// import { SocietyPayload } from '../../../models/society';

// import { LoaderComponent } from '../../loader/loader';
// import { SocietyService } from '../../../service/society.service';

// @Component({
//   selector: 'app-society',
//   standalone: true,
//   imports: [CommonModule, FormsModule, LoaderComponent, Toast, TableModule, ButtonModule],
//   templateUrl: './society.component.html',
//   styleUrls: ['./society.component.scss']
// })
// export class SocietyComponent {

//   private societyService = inject(SocietyService);
//   messageService = inject(MessageService);

//   societySubject!: Subscription;

//   isLoading: boolean = false;
//   showModal: boolean = false;

//   societies: SocietyPayload[] = [];

//   society: SocietyPayload = {
//     name: '',
//     location: '',
//     pincode: ''
//   };

//   ngOnInit(): void {
//     this.fetchAllSocieties();
//   }

//   fetchAllSocieties(): void {
//     this.isLoading = true;
//     this.societySubject = this.societyService.fetchAllSociety().subscribe({
//       next: (res: any) => {
//         this.societies = res.societies;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching societies:', err);
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to fetch society ',
//           life: 3000,
//         });
//       }
//     });
//   }

//   toggleModal(open: boolean) {
//     this.showModal = open;
//   }

//   onSubmitSociety(form: NgForm): void {
//     if (form.valid) {
//       this.createSociety(this.society);
//       form.reset();
//     }
//   }

//   createSociety(society: SocietyPayload): void {
//     this.isLoading = true;
//     this.societySubject = this.societyService.createSociety(society).subscribe({
//       next: (res) => {
//         console.log('Society created:', res);
//         this.isLoading = false;
//         this.toggleModal(false);
//         this.fetchAllSocieties(); // refresh list
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Society added successfully',
//           life: 3000,
//         });
//       },
//       error: (err) => {
//         console.error('Error creating society:', err);
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to add society',
//           life: 3000,
//         });
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.societySubject) this.societySubject.unsubscribe();
//   }
// }
//
//...........................................
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { LoaderComponent } from '../../loader/loader';
import { SocietyService } from '../../../service/society.service';
import { SocietyPayload } from '../../../models/society';

@Component({
  selector: 'app-society',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, Toast, TableModule, ButtonModule],
  templateUrl: './society.component.html',
  styleUrls: ['./society.component.scss'],
  providers: [MessageService],
})
export class SocietyComponent implements OnInit, OnDestroy {
  private societyService = inject(SocietyService);
  messageService = inject(MessageService);

  societySubject!: Subscription;
  isLoading = false;
  showModal = false;
  isEditMode = false;

  societies: any[] = [];

  society: any = {
    id: null,
    name: '',
    location: '',
    pincode: '',
  };

  ngOnInit(): void {
    this.fetchAllSocieties();
  }

  fetchAllSocieties(): void {
    this.isLoading = true;
    this.societySubject = this.societyService.fetchAllSociety().subscribe({
      next: (res: any) => {
        this.societies = res.societies;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching societies:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch societies',
          life: 3000,
        });
      },
    });
  }

  toggleModal(open: boolean, society?: any): void {
    this.showModal = open;
    if (open && society) {
      // edit mode
      this.isEditMode = true;
      this.society = { ...society };
    } else if (open && !society) {
      // create mode
      this.isEditMode = false;
      this.society = { id: null, name: '', location: '', pincode: '' };
    }
  }

  onSubmitSociety(form: NgForm): void {
    if (!form.valid) return;

    if (this.isEditMode && this.society.id) {
      this.updateSociety(this.society.id, this.society);
    } else {
      this.createSociety(this.society);
    }

    form.reset();
  }

  createSociety(society: SocietyPayload): void {
    this.isLoading = true;
    this.societySubject = this.societyService.createSociety(society).subscribe({
      next: res => {
        this.isLoading = false;
        this.toggleModal(false);
        this.fetchAllSocieties();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Society added successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error creating society:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add society',
          life: 3000,
        });
      },
    });
  }

  updateSociety(id: number, society: SocietyPayload): void {
    this.isLoading = true;
    this.societySubject = this.societyService.updateSociety(id, society).subscribe({
      next: () => {
        this.isLoading = false;
        this.toggleModal(false);
        this.fetchAllSocieties();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Society updated successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error updating society:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update society',
          life: 3000,
        });
      },
    });
  }

  deleteSociety(id: number): void {
    if (!confirm('Are you sure you want to delete this society?')) return;

    this.isLoading = true;
    this.societySubject = this.societyService.deleteSociety(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.fetchAllSocieties();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Society deleted successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error deleting society:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete society',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.societySubject) this.societySubject.unsubscribe();
  }
}
