import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { GetCategoryResponse } from '../../../models/category';
import { CategoryService } from '../../../service/category.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-get-category',
  imports: [CommonModule,LoaderComponent],
  templateUrl: './get-category.component.html',
  styleUrl: './get-category.component.scss'
})
export class GetCategoryComponent implements OnInit {

  categoryService:CategoryService= inject(CategoryService);
  router:Router=inject(Router);
  categorySubject! :Subscription;
  isLoading:boolean=false;
  GetAllCategories :GetCategoryResponse[]=[];//empty error


  ngOnInit(): void {
   this.fetchAllCategory()
  }

  fetchAllCategory(){
    this.isLoading=true
     this.categorySubject=this.categoryService.getAllCategory()
    .subscribe({
      next:(res:any)=>{
        this.GetAllCategories = res.categories
        this.isLoading=false;
      },
      error:(err)=>{
        console.log(err)
        this.isLoading=false;
      }
    })
  }

   ngOnDestroy(): void {
    if (this.categorySubject) {
      this.categorySubject.unsubscribe();
    }
  }
}
