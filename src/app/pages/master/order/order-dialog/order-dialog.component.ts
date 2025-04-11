import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
  
export class OrderDialogComponent implements OnInit {

  orderForm: FormGroup;
  action: string;
  local_data: any;
  partyList: any = [];
  searchQuery: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm(this.action === 'Edit' ? this.local_data : undefined);
    (this.local_data?.products || [null]).forEach((product: any) => this.addProduct(product));
    this.getPartyData();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  buildForm(data?: any) {
    this.orderForm = this.fb.group({
      party: [data ? data?.partyId : '', Validators.required],
      designNo: [data ? data?.designNo : ''],
      partyOrder: [data ? data?.partyOrder : '', [Validators.required]],
      orderDate: [data ? this.convertTimestampToDate(this.local_data.orderDate) : new Date(), Validators.required],
      deliveryDate: [data ? this.convertTimestampToDate(this.local_data.deliveryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), Validators.required],
      products: this.fb.array([]),
      orderStatus: [data ? data?.orderStatus : '']
    })
  }

  getProductsFormArry(): FormArray {
    return this.orderForm.get('products') as FormArray
  }

  addProduct(product?: any) {
    this.getProductsFormArry().push(
      this.fb.group({
        productName: [product?.productName || '', [Validators.required]],
        productPrice: [product?.productPrice || '', Validators.required],
        productQuantity: [product?.productQuantity || '', Validators.required],
        productChalanNo: [product?.productChalanNo || ''],
      })
    );
  }

  removeProduct(index: any) {
    this.getProductsFormArry().removeAt(index)
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  saveOrder(): void {
    const payload = {
      partyId: this.orderForm.value.party,
      designNo: this.orderForm.value.designNo,
      partyOrder: this.orderForm.value.partyOrder,
      orderDate: this.orderForm.value.orderDate,
      deliveryDate: this.orderForm.value.deliveryDate,
      products: this.orderForm.value.products,
      orderStatus: this.orderForm.value.orderStatus ? this.orderForm.value.orderStatus : 'Pending',
      isCreated: false
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}