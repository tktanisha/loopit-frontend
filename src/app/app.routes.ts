import { Routes } from '@angular/router';
import { ErrorPageComponent } from './component/error-page/error-page.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { CategoryComponent } from './component/admin/category/category.component';
import { GetCategoryComponent } from './component/admin/get-category/get-category.component';
import { CreateSocietyComponent } from './component/admin/create-society/create-society.component';
import { GetSocietyComponent } from './component/admin/get-society/get-society.component';
import { GetAllProductComponent } from './component/user/browse-items/browse-items.component';
import { GetAllBuyRequestComponent } from './component/user/buy-request/buy-request.component';
import { OrdersComponent } from './component/user/orders/orders.component';
import { ReturnRequestComponent } from './component/user/return-request/return-request.component';

export const routes: Routes = [
     {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children:[
      {path: '', redirectTo:'home' ,pathMatch:'full'},
      {path:'home', component: HomeComponent},
      {path:'create-category', component: CategoryComponent},
      {path:'all-categories', component: GetCategoryComponent},
      {path:'create-society', component: CreateSocietyComponent},
      {path:'all-societies', component: GetSocietyComponent},
      {path:'all-products', component: GetAllProductComponent},
      {path:'all-requests', component: GetAllBuyRequestComponent},
      {path:'all-rentals', component: OrdersComponent},
      {path:'return-request', component: ReturnRequestComponent},

    ]
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];


