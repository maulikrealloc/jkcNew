import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../chalan-list/product-dialog/product-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {

  displayedColumns: string[] = ['srNo', 'productPrice', 'totalAmount', 'action'];
  paymentList: FormGroup;
  action: string;
  local_data: any;
  paymentListDataSource: any;
  invoiceList: any = [];


  constructor(
    private fb : FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    if (this.action === 'Add Payment') {
      this.getInvoiceData();
    }
    this.buildForm()
  }

  buildForm(){
    this.paymentList = this.fb.group({
      paymentReceive : [''],
      paymentDate: [new Date()]
    })
  }

  getInvoiceData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'InvoiceList').then((invoice) => {
      if (invoice && invoice.length > 0) {
        this.invoiceList = invoice
      }
    }).catch((error) => {
      console.error('Error fetching chalan:', error);
    });
  }

  addPaymentData() {
    const payload = {
      paymentReceive : this.paymentList.value.paymentReceive,
      paymentDate : this.paymentList.value.paymentDate
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
