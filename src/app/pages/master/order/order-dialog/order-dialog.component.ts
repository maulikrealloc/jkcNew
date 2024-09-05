import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {
  orderForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
  ngOnInit(): void {
    this.buildForm()
    this.addProduct()
    if (this.action === 'Edit') {
      this.orderForm.controls['party'].setValue(this.local_data.party)
      this.orderForm.controls['designNo'].setValue(this.local_data.designNo)
      this.orderForm.controls['partyOrder'].setValue(this.local_data.partyOrder)
      this.orderForm.controls['orderDate'].setValue(this.local_data.orderDate)
      this.orderForm.controls['deliveryDate'].setValue(this.local_data.deliveryDate)
      this.orderForm.controls['products'].setValue(this.local_data.products)
    }
  }

  buildForm() {
    this.orderForm = this.fb.group({
      party: ['', Validators.required],
      designNo: ['', Validators.required],
      partyOrder: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      orderDate: [new Date(), Validators.required],
      deliveryDate: [new Date(), Validators.required],
      products: this.fb.array([])
    })
  }

  getProductsFormArry() {
    return this.orderForm.get('products') as FormArray
  }

  addProduct() {
    this.getProductsFormArry().push(this.fb.group({
      productName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      productPrice: ['', Validators.required],
      productQuantity: ['', Validators.required],
    }))
  }

  removeProduct(index: any) {
    this.getProductsFormArry().removeAt(index)

  }
  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      party: this.orderForm.value.party,
      designNo: this.orderForm.value.designNo,
      partyOrder: this.orderForm.value.partyOrder,
      orderDate: this.orderForm.value.orderDate,
      deliveryDate: this.orderForm.value.deliveryDate,
      products: this.orderForm.value.products

    }

    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
