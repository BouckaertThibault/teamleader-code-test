import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OrderService } from './order.service';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { OrderItem } from '../../models/order/order.model';
import { of } from 'rxjs';

import mockOrder1 from '../../../../assets/orders/order1.json';
import mockOrder2 from '../../../../assets/orders/order2.json';
import mockOrder3 from '../../../../assets/orders/order3.json';
import mockCustomers from '../../../../assets/customers/customers.json';
import mockProducts from '../../../../assets/products/products.json';

const mockOrderResult = [
  {
    id: '1',
    'customer-id': '1',
    items: [
      {
        'product-id': 'B102',
        quantity: '10',
        'unit-price': '4.99',
        total: '49.90',
        product: {
          id: 'B102',
          description: 'Press button',
          category: '2',
          price: '4.99',
        },
      },
    ],
    total: '49.90',
    customer: {
      id: '1',
      name: 'Coca Cola',
      since: '2014-06-28',
      revenue: '492.12',
    },
  },
  {
    id: '2',
    'customer-id': '2',
    items: [
      {
        'product-id': 'B102',
        quantity: '5',
        'unit-price': '4.99',
        total: '24.95',
        product: {
          id: 'B102',
          description: 'Press button',
          category: '2',
          price: '4.99',
        },
      },
    ],
    total: '24.95',
    customer: {
      id: '2',
      name: 'Teamleader',
      since: '2015-01-15',
      revenue: '1505.95',
    },
  },
  {
    id: '3',
    'customer-id': '3',
    items: [
      {
        'product-id': 'A101',
        quantity: '2',
        'unit-price': '9.75',
        total: '19.50',
        product: {
          id: 'A101',
          description: 'Screwdriver',
          category: '1',
          price: '9.75',
        },
      },
      {
        'product-id': 'A102',
        quantity: '1',
        'unit-price': '49.50',
        total: '49.50',
        product: {
          id: 'A102',
          description: 'Electric screwdriver',
          category: '1',
          price: '49.50',
        },
      },
    ],
    total: '69.00',
    customer: {
      id: '3',
      name: 'Jeroen De Wit',
      since: '2016-02-11',
      revenue: '0.00',
    },
  },
];

describe('OrderService', () => {
  function setup() {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService, CustomerService, ProductService],
    });

    let orderService = TestBed.inject(OrderService);
    let customerService = TestBed.inject(CustomerService);
    let productService = TestBed.inject(ProductService);

    // test with only one endpoint returning valid data
    spyOn(orderService['http'], 'get')
      .withArgs('assets/orders/order1.json')
      .and.returnValue(of(mockOrder1))
      .withArgs('assets/orders/order2.json')
      .and.returnValue(of(mockOrder2))
      .withArgs('assets/orders/order3.json')
      .and.returnValue(of(mockOrder3));

    spyOn(customerService, 'getCustomers').and.returnValue(of(mockCustomers));
    spyOn(productService, 'getProducts').and.returnValue(of(mockProducts));
    spyOn(orderService, 'getOrders').and.callThrough();

    return { orderService, customerService, productService };
  }

  it('should be created', () => {
    const { orderService } = setup();

    expect(orderService).toBeTruthy();
  });

  it('should get orders and update the local state', () => {
    const { orderService } = setup();

    orderService.getOrders().subscribe(orders => {
      expect(orders).toEqual(mockOrderResult);
      expect(orderService.orders()).toEqual(mockOrderResult);
    });
  });

  it('should get a single order', () => {
    const { orderService } = setup();

    orderService.getOrder('2').subscribe(order => {
      expect(order).toEqual(mockOrderResult[1]);
    });
  });

  it('should calculate the total price correctly', () => {
    const { orderService } = setup();

    const totalPrice = orderService.combineProductPrices(
      mockOrderResult[0].items
    );

    expect(totalPrice).toEqual(49.9);
  });

  it('should add a new item to the order', () => {
    const { orderService } = setup();

    const newItem: OrderItem = {
      'product-id': 'A101',
      quantity: '2',
      'unit-price': '9.75',
      total: '19.50',
      product: {
        id: 'A101',
        description: 'Screwdriver',
        category: '1',
        price: '9.75',
      },
    };

    const updatedOrder = orderService.addItemToOrder(
      mockOrderResult[0],
      newItem
    );

    expect(updatedOrder.items.length).toBe(2);
    expect(updatedOrder.items[1]).toEqual(newItem);
  });

  it('should remove an item from the order', () => {
    const { orderService } = setup();

    const updatedOrder = orderService.removeItemFromOrder(
      mockOrderResult[0],
      mockOrderResult[0].items[0]
    );

    expect(updatedOrder.items.length).toBe(0);
  });
});
