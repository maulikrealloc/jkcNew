import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../chalan-list/product-dialog/product-dialog.component';
@Component({
  selector: 'app-chalan-view-dialog',
  templateUrl: './chalan-view-dialog.component.html',
  styleUrls: ['./chalan-view-dialog.component.scss']
})

export class ChalanViewDialogComponent implements OnInit {

  displayedDataColumns: string[] = ['srNo', 'partyOrder', 'productName', 'Quantity', 'productPrice', 'chalanNo', 'totalAmount'];
  action: string;
  local_data: any;
  orderList: any = [];
  selectedProduct: any;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    if (this.action === 'Chalan View') {
      // this.getOrderData();
    }
  }

  doAction() {
    this.dialogRef.close({ event: this.action });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}