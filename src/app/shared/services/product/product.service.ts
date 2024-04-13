import { Injectable, signal } from '@angular/core';
import { Product } from '../../models/product/product.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products = signal<Product[]>([]);

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http
      .get<Product[]>(`assets/products/products.json`)
      .pipe(tap(products => this.products.set(products)));
  }
}
