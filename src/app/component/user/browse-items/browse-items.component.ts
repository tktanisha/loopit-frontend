
import { Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { ProductResponse } from '../../../models/product';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader';

@Component({
  selector: 'app-browse-items',
  imports: [ProductModalComponent,CommonModule,LoaderComponent],
  templateUrl: './browse-items.component.html',
  styleUrl: './browse-items.component.scss'
})
export class GetAllProductComponent implements OnInit{

  router:Router=inject(Router)
  productService:ProductService=inject(ProductService)
  selectedProduct!:ProductResponse
  allProduct:ProductResponse[]=[]
  isLoading:boolean=false;
  isOpenModal:boolean=false

 
ngOnInit():void {
  this.fetchAllProduct()
}

fetchAllProduct(){
  this.isLoading=true
  this.productService.FetchAllProduct()
  .subscribe({
    next:(products:any)=>{
      console.log(products)
      this.allProduct=products.products
      this.isLoading=false
    },
    error:(err)=>{
      console.log(err)
      this.isLoading=false
    }

  }
  )
}


handleOpenModal(product:ProductResponse){
this.selectedProduct=product
this.isOpenModal=true
}

handleOnClose(){
  this.isOpenModal=false;
}


  
}
