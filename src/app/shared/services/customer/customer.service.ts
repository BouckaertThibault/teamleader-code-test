import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Customer } from '../../models/customer/customer.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customers = signal<Customer[]>([]);

  constructor(private http: HttpClient) {}

  getCustomers() {
    return this.http
      .get<Customer[]>(`assets/customers/customers.json`)
      .pipe(tap(customers => this.customers.set(customers)));
  }
}
