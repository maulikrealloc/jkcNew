import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-chalanedit-dialog',
  templateUrl: './chalanedit-dialog.component.html',
  styleUrls: ['./chalanedit-dialog.component.scss']
})
export class ChalaneditDialogComponent implements OnInit {
  chalanForm: FormGroup;
  firmList: any = [];
  partyList: any = [];
  orderList: any = [];
  action: string;
  local_data: any;

  constructor(private fb: FormBuilder, private commonService: CommonService,
    public dialogRef: MatDialogRef<ChalaneditDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) 
    {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    
   }

  ngOnInit(): void {
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined);
    this.getFirmData();
    this.getPartyData();
    this.getOrderData();
  }

  getFirmData() {
    this.commonService.fetchData('FirmList', this.firmList);
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList)
  }

  getOrderData() {
    this.commonService.fetchData('OrderList', this.orderList).then((data) => {
      const productslist = this.orderList.find((obj: any) => obj.id === this.local_data.partyOrderId).products;
     
      if (productslist) {
        this.addProduct(productslist);
      }
    });;
  }
  
  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  formBuild(data:any) {
    this.chalanForm = this.fb.group({
      chalanDate: [data ? this.convertTimestampToDate(data?.chalanDate) : ''],
      firmId: [data ? data?.firmId : ''],
      partyId: [data ? data?.partyId : ''],
      partyOrderId: [data ? data?.partyOrderId : ''],
      products: this.fb.array([]),
    })
  }

  getProductsFormArry(): FormArray {
    return this.chalanForm.get('products') as FormArray
  }

  addProduct(productslist: any, startIndex: number = 0) {
    const productsArray = this.getProductsFormArry();
    productslist?.forEach((product: any, i: number) => {
      productsArray.push(
        this.fb.group({
          productIndex: startIndex + i,  
          productName: [product?.productName, ''],
          productPrice: [product?.productPrice, 0],
          productQuantity: [product?.productQuantity, 0],
          productChalanNo: [product?.productChalanNo, '']
        })
      );
    });
  }

  chalandata() {
    const payload = {
      ...this.chalanForm.value,
      id: this.local_data.id 
    };
    this.dialogRef.close({ event: this.action, data: payload });
    console.log(this.chalanForm.value);
    
  }

}
