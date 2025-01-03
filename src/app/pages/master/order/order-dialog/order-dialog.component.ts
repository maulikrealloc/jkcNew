import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

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
    private firebaseCollectionService: FirebaseCollectionService) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.orderForm.controls['party'].setValue(this.local_data.partyId)
      this.orderForm.controls['designNo'].setValue(this.local_data.designNo)
      this.orderForm.controls['partyOrder'].setValue(this.local_data.partyOrder)
      this.orderForm.controls['orderDate'].setValue(this.convertTimestampToDate(this.local_data.orderDate))
      this.orderForm.controls['deliveryDate'].setValue(this.convertTimestampToDate(this.local_data.deliveryDate))
      this.orderForm.controls['orderStatus'].setValue(this.local_data.orderStatus)
      this.local_data.products.forEach((element: any) => {
        this.addProduct(element);
      });
    } else {
      this.addProduct()
    }
    this.getPartyData();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  buildForm() {
    this.orderForm = this.fb.group({
      party: ['', Validators.required],
      designNo: [''],
      partyOrder: ['', [Validators.required]],
      orderDate: [new Date(), Validators.required],
      deliveryDate: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), Validators.required],
      products: this.fb.array([]),
      orderStatus: ['']
    })
  }

  getProductsFormArry() {
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
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      if (party && party.length > 0) {
        this.partyList = party
      }
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  doAction(): void {
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