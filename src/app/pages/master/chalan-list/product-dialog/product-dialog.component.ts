import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';


@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {
  displayedColumns: string[] = ['srNo', 'productName', 'productQuantity', 'productPrice', 'totalAmount'];
  action: string;
  local_data: any;
  orderList: any = [];
  selectedProduct: any;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
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
    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      if (order && order.length > 0) {
        this.orderList = order
        this.selectedProduct = this.orderList.find((obj: any) => obj.id === this.local_data.partyOrderId).products
      }
    }).catch((error) => {
      console.error('Error fetching order:', error);
    });
  }
  
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
