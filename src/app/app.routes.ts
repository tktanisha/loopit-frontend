import { Routes } from '@angular/router';
import { ErrorPageComponent } from './component/error-page/error-page.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { CategoryComponent } from './component/admin/category/category.component';
import { GetAllProductComponent } from './component/user/browse-items/browse-items.component';
import { GetAllBuyRequestComponent } from './component/user/buy-request/buy-request.component';
import { OrdersComponent } from './component/user/orders/orders.component';
import { ReturnRequestComponent } from './component/user/return-request/return-request.component';
import { CreateProductComponent } from './component/lender/create-product/create-product.component';
import { DashboardHomeComponent } from './component/dashboard-home/dashboard-home.component';
import { PendingBuyRequestComponent } from './component/user/pending-buy-request/pending-buy-request.component';
import { LenderHistoryComponent } from './component/lender/lender-history/lender-history.component';
import { ApprovedAwaitingOrdersComponent } from './component/lender/approved-awaiting-orders/approved-awaiting-orders.component';
import { SocietyComponent } from './component/admin/society/society.component';
import { AuthGuard } from './service/auth.guard';
import { UserManagementGuard } from './service/access-denied.guard';
import { AccessDeniedComponent } from './component/access-denied/access-denied.component';
import { UserComponent } from './component/admin/user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'home', component: DashboardHomeComponent, canActivate: [UserManagementGuard] },
      {
        path: 'categories',
        component: CategoryComponent,
        canActivate: [UserManagementGuard],
      },
      {
        path: 'societies',
        component: SocietyComponent,
        canActivate: [UserManagementGuard],
      },
      {
        path: 'users',
        component: UserComponent,
        canActivate: [UserManagementGuard],
      },
      { path: 'all-products', component: GetAllProductComponent },
      { path: 'create-products', component: CreateProductComponent },
      { path: 'buy-requests', component: GetAllBuyRequestComponent },
      { path: 'all-rentals', component: OrdersComponent },
      { path: 'return-requests', component: ReturnRequestComponent },
      { path: 'become-lender', component: HomeComponent },
      {
        path: 'all-pending-buy-requests',
        component: PendingBuyRequestComponent,
      },
      { path: 'orders/history', component: OrdersComponent },
      { path: 'orders/lender/history', component: LenderHistoryComponent },
      {
        path: 'orders/approved-awaiting',
        component: ApprovedAwaitingOrdersComponent,
      },
    ],
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];
