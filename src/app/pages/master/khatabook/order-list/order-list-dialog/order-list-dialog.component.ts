import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { validateEvents } from 'angular-calendar/modules/common/util';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

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
    private fb: FormBuilder, private firebaseCollectionService: FirebaseCollectionService,
    public dialogRef: MatDialogRef<OrderListDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild()
    if (this.action === 'Edit') {
      this.orderForm.controls['party'].setValue(this.local_data.party)
      this.orderForm.controls['order'].setValue(this.local_data.order)
      this.orderForm.controls['khata'].setValue(this.local_data.khata)
      this.orderForm.controls['date'].setValue(this.local_data.date)
    }
    this.getKhataData();
    this.getPartyData();
    this.getOrderData();
    
  }

  formBuild() {
    this.orderForm = this.fb.group({
      party: [''],
      order: [''],
      khata: [''],
      date: new Date(),
      productsOrder: this.fb.array([])
    })
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
    this.firebaseCollectionService.getDocuments('CompanyList', 'KhataList').then((khata) => {
      this.khataList = khata
    }).catch((error) => {
      console.error('Error fetching khata:', error);
    });
  }

  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      if (party && party.length > 0) {
        this.partyList = party
      }
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  getOrderData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      if (order && order.length > 0) {
        this.orderList = order
      }
    }).catch((error) => {
      console.error('Error fetching order:', error);
    });
  }

  doAction(): void {
    const payload = {
      party: this.orderForm.value.party,
      order: this.orderForm.value.order,
      khata: this.orderForm.value.khata,
      date: this.orderForm.value.date,
      productsOrder: this.orderForm.value.productsOrder,
      status: 'Pending'
    }
    
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}