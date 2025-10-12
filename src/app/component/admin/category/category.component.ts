// import { Component, inject } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { MessageService } from 'primeng/api';
// import { Toast } from 'primeng/toast';
// import { TableModule } from 'primeng/table';
// import { ButtonModule } from 'primeng/button';

// import { CategoryRequest, GetCategoryResponse } from '../../../models/category';

// import { CategoryService } from '../../../service/category.service';
// import { LoaderComponent } from '../../loader/loader';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-category',
//   standalone: true,
//   imports: [CommonModule, FormsModule, LoaderComponent, TableModule, ButtonModule, Toast],
//   templateUrl: './category.component.html',
//   styleUrls: ['./category.component.scss'],
//   providers: [MessageService],
// })

// export class CategoryComponent implements OnDestroy {
//   private categoryService = inject(CategoryService);
//   messageService = inject(MessageService);

//   categorySubject!: Subscription;

//   showModal:boolean = false;
//   isLoading: boolean = false;

//   categories: GetCategoryResponse[] = [];

//   category: CategoryRequest = {
//     name: '',
//     price: null,
//     security: null,
//   };

//   ngOnInit(): void {
//     this.fetchAllCategories();
//   }

//   fetchAllCategories() {
//     this.isLoading = true;
//     this.categorySubject = this.categoryService.getAllCategory().subscribe({
//       next: (res: any) => {
//         this.categories = res.categories;
//         this.isLoading = false;
//       },
//       error: err => {
//         console.log(err);
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to fetch category ',
//           life: 3000,
//         });
//       },
//     });
//   }

//   toggleModal(open: boolean) {
//     this.showModal = open;
//   }

//   onSubmitCategory(form: NgForm) {
//     if (form.valid) {
//       this.createCategory(this.category);
//       form.reset();
//     }
//   }

//   createCategory(category: CategoryRequest): void {
//     this.isLoading = true;

//     this.categorySubject = this.categoryService.createCategory(category).subscribe({
//       next: (res) => {
//         console.log('Category created:', res);
//         this.isLoading = false;
//         this.toggleModal(false);
//         this.fetchAllCategories(); // refresh list
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'category added successfully',
//           life: 3000,
//         });
//       },
//       error: err => {
//         console.error('Error creating category:', err);
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Error creating category',
//           life: 3000,
//         });
//       },
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.categorySubject) this.categorySubject.unsubscribe();
//   }
// }
//............................................................................
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { LoaderComponent } from '../../loader/loader';
import { CategoryRequest, GetCategoryResponse } from '../../../models/category';
import { CategoryService } from '../../../service/category.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    TableModule,
    ButtonModule,
    Toast,
    ConfirmDialogModule,
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class CategoryComponent implements OnDestroy {
  private categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  categorySubject!: Subscription;
  showModal: boolean = false;
  isLoading: boolean = false;
  isEditMode: boolean = false;

  categories: GetCategoryResponse[] = [];

  category: CategoryRequest = {
    name: '',
    price: null,
    security: null,
  };

  selectedCategoryId: number | null = null;

  ngOnInit(): void {
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.isLoading = true;
    this.categorySubject = this.categoryService.getAllCategory().subscribe({
      next: (res: any) => {
        this.categories = res.categories;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch category',
          life: 3000,
        });
      },
    });
  }

  toggleModal(open: boolean, category?: GetCategoryResponse) {
    this.showModal = open;

    if (open && category) {
      // Edit mode
      this.isEditMode = true;
      this.selectedCategoryId = category.id;
      this.category = {
        name: category.name,
        price: category.price,
        security: category.security,
      };
    } else if (open && !category) {
      // Create mode
      this.isEditMode = false;
      this.category = { name: '', price: null, security: null };
      this.selectedCategoryId = null;
    }
  }

  onSubmitCategory(form: NgForm) {
    if (form.valid) {
      if (this.isEditMode && this.selectedCategoryId !== null) {
        this.updateCategory(this.selectedCategoryId, this.category);
      } else {
        this.createCategory(this.category);
      }
      form.reset();
    }
  }

  createCategory(category: CategoryRequest): void {
    this.isLoading = true;

    this.categorySubject = this.categoryService.createCategory(category).subscribe({
      next: res => {
        this.isLoading = false;
        this.toggleModal(false);
        this.fetchAllCategories();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category added successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error creating category:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error creating category',
          life: 3000,
        });
      },
    });
  }

  updateCategory(id: number, category: CategoryRequest): void {
    this.isLoading = true;

    this.categorySubject = this.categoryService.updateCategory(id, category).subscribe({
      next: () => {
        this.isLoading = false;
        this.toggleModal(false);
        this.fetchAllCategories();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Category updated successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error updating category:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating category',
          life: 3000,
        });
      },
    });
  }

  confirmDeleteCategory(category: GetCategoryResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete category "${category.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCategory(category.id),
    });
  }

  deleteCategory(id: number): void {
    this.isLoading = true;
    this.categorySubject = this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.fetchAllCategories();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Category deleted successfully',
          life: 3000,
        });
      },
      error: err => {
        console.error('Error deleting category:', err);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting category',
          life: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.categorySubject) this.categorySubject.unsubscribe();
  }
}
