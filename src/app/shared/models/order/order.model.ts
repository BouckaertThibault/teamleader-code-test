import { Customer } from '../customer/customer.model';
import { Product } from '../product/product.model';

export interface Order {
  id: string;
  'customer-id': string;
  customer: Customer;
  items: OrderItem[];
  total: string;
}

export interface OrderItem {
  'product-id': string;
  quantity: string;
  'unit-price': string;
  total: string;
  product: Product;
}
