import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editchalan',
  templateUrl: './editchalan.component.html',
  styleUrls: ['./editchalan.component.scss']
})
export class EditchalanComponent implements OnInit {
  editchalanForm: FormGroup
  local_data: any;
  action: string;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditchalanComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.chalanlist(this.action === 'Edit' ? this.local_data : undefined)
  }

  chalanlist(data: any) {
    this.editchalanForm = this.fb.group({
      productName: [data ? data?.productName : ''],
      productPrice: [data ? data?.productPrice : ''],
      quantity: [data ? data?.quantity : ''],
      // chalanNo: [data ? data?.chalanNo : ''],
      // totalAmount: [{ value: data ? data?.totalAmount : '', disabled: true }] 
    });
    this.editchalanForm.get('productPrice')?.valueChanges.subscribe(() => this.updateTotalAmount());
    this.editchalanForm.get('quantity')?.valueChanges.subscribe(() => this.updateTotalAmount());
  }

  updateTotalAmount() {
    const productPrice = this.editchalanForm.get('productPrice')?.value || 0;
    const quantity = this.editchalanForm.get('quantity')?.value || 0;
    this.editchalanForm.patchValue({
      totalAmount: productPrice * quantity
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: this.action, data: this.editchalanForm.value });
  }

}
