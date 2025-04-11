import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss']
})
export class EditInvoiceComponent implements OnInit {
  invoiceForm: FormGroup
  local_data: any;
  action: string;
  
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditInvoiceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
   }
  
  ngOnInit(): void {
    this.invoicelist(this.action === 'Edit' ? this.local_data : undefined)
  }

  invoicelist(data:any) {
    this.invoiceForm = this.fb.group({
      productName: [data ? data?.productName : ''],
      productPrice: [data ? data?.productPrice :''],
      quantity: [data ? data?.productQuantity :''],
      // chalanNo: [data ? data?.productChalanNo :''],
      // totalAmount: [data ? data?.productPrice * data?.productQuantity :''],
      // finalAmount: [data ? data?.productPrice * data?.productQuantity :''],
    })
  }

  closeDialog() {
    this.dialogRef.close({ event: this.action, data: this.invoiceForm.value });
  }
}
