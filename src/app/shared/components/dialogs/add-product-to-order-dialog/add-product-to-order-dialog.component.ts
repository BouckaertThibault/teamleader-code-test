import { Component, signal } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../models/product/product.model';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './add-product-to-order-dialog.component.html',
  styleUrl: './add-product-to-order-dialog.component.scss',
})
export class AddProductDialogComponent {
  productForm = new FormGroup({
    product: new FormControl<Product | undefined>(undefined, [
      Validators.required,
    ]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
  });
  products = signal<Product[]>([]);

  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: ProductService
  ) {
    this.productService
      .getProducts()
      .subscribe(data => this.products.set(data));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAddClick() {
    const formValue = this.productForm.value;

    const toBeAddedProduct = {
      ...formValue,
      quantity: formValue.quantity?.toString(),
      ['product-id']: formValue.product?.id,
      ['unit-price']: formValue.product?.price,
      total: (
        Number(formValue.product?.price) * formValue.quantity!
      ).toString(),
    };

    this.dialogRef.close(toBeAddedProduct);
  }
}
