import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './orders/orders-detail/orders-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  {
    path: 'orders',
    component: OrdersListComponent,
  },
  { path: 'orders/:id', component: OrdersDetailComponent },
];
