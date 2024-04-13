import { Component, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../shared/models/order/order.model';
import { Router } from '@angular/router';
import { OrderService } from '../../shared/services/order/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent {
  displayedColumns: string[] = ['customer', 'products', 'total'];
  tableDataSource = computed(() => this.orderService.orders() || []);

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  goToDetail(row: Order) {
    this.router.navigate(['/orders', row.id]);
  }
}
