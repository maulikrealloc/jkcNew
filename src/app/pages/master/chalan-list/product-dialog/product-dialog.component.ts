import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})

export class ProductDialogComponent implements OnInit {

  displayedDataColumns: string[] = ['srNo', 'productName', 'productQuantity', 'productPrice', 'totalAmount'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  action: string;
  local_data: any;
  orderList: any = [];
  selectedProduct: any;
  productListDataSource = new MatTableDataSource(this.orderList);

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
    this.commonService.fetchData('OrderList', this.orderList).then((data) => {
      this.productListDataSource = this.orderList.find((obj: any) => obj.id === this.local_data.partyOrderId).products;
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}