import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { forkJoin, map, of, tap } from 'rxjs';
import { Order, OrderItem } from '../../models/order/order.model';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { Customer } from '../../models/customer/customer.model';
import { Product } from '../../models/product/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orders = signal<Order[]>([]);

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.getOrders().subscribe();
  }

  // on the first time of application load, load the dummy data, otherwise return our stored data to be able to show edits
  getOrders() {
    if (this.orders().length) {
      return of(this.orders());
    } else {
      return forkJoin({
        orders: forkJoin(
          Array.from(Array(3)).map((value, i) =>
            this.http.get<Order>(`assets/orders/order${i + 1}.json`)
          )
        ),
        customers: this.customerService.getCustomers(),
        products: this.productService.getProducts(),
      }).pipe(
        map(({ orders, customers, products }) => {
          // We include customer and product data to our orders, but ideally this should already be included by the backend
          let validOrders: Order[] = [];

          orders.forEach(order => {
            order.customer =
              customers.find(
                customer => customer.id === order['customer-id']
              ) || ({} as Customer);
            order.items.forEach(item => {
              item.product =
                products.find(product => product.id === item['product-id']) ||
                ({} as Product);
            });
            validOrders.push(order);
          });
          return validOrders;
        }),
        tap(orders => {
          this.orders.set(orders);
        })
      );
    }
  }

  // return local state if available instead of dummy data, edits are otherwise not shown
  getOrder(id: string) {
    if (this.orders().length) {
      return of(this.orders().find(order => order.id === id));
    } else {
      // return this.http.get<Order>(`assets/orders/order${id}.json`)
      return forkJoin({
        order: this.http.get<Order>(`assets/orders/order${id}.json`),
        customers: this.customerService.getCustomers(),
        products: this.productService.getProducts(),
      }).pipe(
        map(({ order, customers, products }) => {
          // We include customer and product data to our orders, but ideally this should already be included by the backend
          order.customer =
            customers.find(customer => customer.id === order['customer-id']) ||
            ({} as Customer);
          order.items.forEach(item => {
            item.product =
              products.find(product => product.id === item['product-id']) ||
              ({} as Product);
          });

          return order;
        })
      );
    }
  }

  combineProductPrices(products: OrderItem[]) {
    return products?.reduce((sum, item) => sum + Number(item.total), 0);
  }

  addItemToOrder(order: Order, newItem: OrderItem): Order {
    const newItems = order.items.map(item => ({ ...item }));
    const existingItemIndex = newItems.findIndex(
      item => item['product-id'] === newItem['product-id']
    );

    if (existingItemIndex !== -1) {
      newItems[existingItemIndex].quantity = (
        Number(newItems[existingItemIndex].quantity) + Number(newItem.quantity)
      ).toString();
      newItems[existingItemIndex].total = (
        Number(newItems[existingItemIndex].total) + Number(newItem.total)
      ).toString();
    } else {
      newItems.push({ ...newItem });
    }

    const updatedOrder = {
      ...order,
      items: newItems,
      total: this.combineProductPrices(newItems).toString(),
    };

    this.orders.update(existingOrders =>
      existingOrders.map(existingOrder =>
        existingOrder.id === order.id ? updatedOrder : existingOrder
      )
    );

    return updatedOrder;
  }

  removeItemFromOrder(order: Order, toBeRemovedItem: OrderItem): Order {
    const updatedItems = order.items.filter(
      item => item['product-id'] !== toBeRemovedItem['product-id']
    );

    if (order.items.length === updatedItems.length) {
      return { ...order };
    }

    const updatedOrder = {
      ...order,
      items: updatedItems,
      total: this.combineProductPrices(updatedItems).toString(),
    };

    this.orders.update(existingOrders =>
      existingOrders.map(existingOrder =>
        existingOrder.id === order.id ? updatedOrder : existingOrder
      )
    );

    return updatedOrder;
  }

  placeOrder(order: Order) {
    this.snackBar.open(
      `Order ${order.id} with a price total of ${order.total} has been placed!`,
      undefined,
      { panelClass: ['succes-snackbar'], duration: 2500 }
    );
  }
}
