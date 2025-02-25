import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-order-list-dialog',
  templateUrl: './order-list-dialog.component.html',
  styleUrls: ['./order-list-dialog.component.scss']
})

export class OrderListDialogComponent implements OnInit {

  orderForm: FormGroup;
  action: string;
  local_data: any;
  khataList: any = [];
  partyList: any = [];
  orderList: any = [];
  filterOrderList: any = [];

  constructor(
    private fb: FormBuilder, private commonService: CommonService,
    public dialogRef: MatDialogRef<OrderListDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.getKhataData();
    this.getPartyData();
    this.getOrderData();
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined)
  }

  formBuild(data: any) {
    this.orderForm = this.fb.group({
      party: [data ? data?.party : ''],
      order: [data ? data?.order : ''],
      khata: [data ? data?.khata : ''],
      date: [data ? this.convertTimestampToDate(this.local_data.date) : new Date()],
      productsOrder: this.fb.array([])
    })
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  get productsOrder() {
    return this.orderForm.get('productsOrder') as FormArray;
  }

  removeProduct(index: number) {
    this.productsOrder.removeAt(index);
  }

  onPartySelection(selectedPartyId: string) {
    this.filterOrderList = this.orderList.filter(
      (order: any) => order.partyId === selectedPartyId && order.orderStatus === 'Pending'
    );
  }

  onOrderSelection() {
    if (this.filterOrderList.length > 0) {
      const selectedOrderId = this.orderForm.get('order')?.value;
      const selectedOrder = this.filterOrderList.find((order:any) => order.id === selectedOrderId);

      if (selectedOrder && selectedOrder.products) {
        const products = selectedOrder.products;
        this.updateProductsFormArray(products);
      }
    }
  }

  updateProductsFormArray(products: any[]) {
    const productsArray = this.orderForm.get('productsOrder') as FormArray;
    productsArray.clear();
    products.forEach(product => {
      productsArray.push(
        this.fb.group({
          productName: [product.productName, Validators.required],
          productQuantity: [product.productQuantity, Validators.required],
          productPrice: [product.productPrice, Validators.required],
          khataPrice: [ Validators.required],
        })
      );
    });
  }

  getKhataData() {
    this.commonService.fetchData('KhataList', this.khataList)
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList)
  }

  getOrderData() {
    this.commonService.fetchData('OrderList', this.orderList).then((data) => {
      if (this.action === 'Edit') {
        this.filterOrderList = this.orderList.filter(
          (order: any) => order.id === this.local_data?.order
        );
        this.orderForm.get('order')?.setValue(this.orderList.find((id: any) => id.id === this.local_data?.order).id)
        this.onOrderSelection();
      }
    })
  }

  doAction(): void {
    const payload = this.orderForm.value;
    payload.status = 'Pending'
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}