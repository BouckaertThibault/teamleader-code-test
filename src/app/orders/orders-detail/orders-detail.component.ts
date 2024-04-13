import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
import { OrderService } from '../../shared/services/order/order.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Order, OrderItem } from '../../shared/models/order/order.model';
import { MatListModule } from '@angular/material/list';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../../shared/components/dialogs/add-product-to-order-dialog/add-product-to-order-dialog.component';

@Component({
  selector: 'app-orders-detail',
  standalone: true,
  imports: [
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './orders-detail.component.html',
  styleUrl: './orders-detail.component.scss',
})
export class OrdersDetailComponent implements OnInit {
  order = signal<Order | undefined>(undefined);
  tableDataSource = computed(() => this.order()!?.items || []);
  displayedColumns: string[] = [
    'product',
    'quantity',
    'unit-price',
    'total',
    'action',
  ];
  productsTotalPrice = computed(() =>
    this.orderService.combineProductPrices(this.order()!?.items)
  );

  @ViewChild(MatTable) table!: MatTable<Order>;

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.orderService.getOrder(params.get('id')!)
        )
      )
      .subscribe(order => {
        if (order) {
          this.order.set(order);
        }
      });
  }

  addItem() {
    const dialogRef = this.dialog.open(AddProductDialogComponent);

    dialogRef.afterClosed().subscribe((toBeAddedProduct: OrderItem) => {
      if (toBeAddedProduct) {
        const newOrder = this.orderService.addItemToOrder(
          this.order()!,
          toBeAddedProduct
        );

        // update local view
        this.order.set(newOrder);
        this.table.renderRows();
      }
    });
  }

  removeItem(orderItem: OrderItem) {
    const updatedOrder = this.orderService.removeItemFromOrder(
      this.order()!,
      orderItem
    );

    // Update local view
    this.order.set(updatedOrder);
    this.table.renderRows();
  }

  placeOrder() {
    this.orderService.placeOrder(this.order()!);
    this.router.navigate(['/orders']);
  }
}
