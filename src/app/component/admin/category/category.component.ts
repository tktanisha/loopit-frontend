import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryRequest } from '../../../models/category';
import { CategoryService } from '../../../service/category.service';
import { FormsModule,NgForm } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-create-category',
  imports:[FormsModule,LoaderComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  private categoryService = inject(CategoryService);
  private router = inject(Router);

  isLoading:boolean=false

  category: CategoryRequest = {
    name: '',
    price: 0,
    security: 0
  };

  onSubmitCategory(form :NgForm){
    console.log("form=",form)
    console.log("form values ",form.value)

    if(form.valid){
    this.createCategory(this.category)
    }

    form.reset()
  }

  createCategory(category:CategoryRequest): void {

    this.isLoading=true

    this.categoryService.createCategory(category).subscribe({
      next: (res) => {
        console.log('Category created:', res);
        this.isLoading=false
        
      },
      error: (err) => {
        console.error('Error creating category:', err);
        this.isLoading=false
      }
    });
  }
}
