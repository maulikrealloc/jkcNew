import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})

export class ProductDialogComponent implements OnInit {

  displayedDataColumns: string[] = ['srNo', 'productName', 'productQuantity', 'productPrice', 'totalAmount'];
  action: string;
  local_data: any;
  orderList: any = [];
  selectedProduct: any;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    if (this.action === 'Product List') {
      this.getOrderData();
    }
  }

  doAction() {
    this.dialogRef.close({ event: this.action });
  }

  getOrderData() {
    this.commonService.fetchData('OrderList', this.orderList);
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}