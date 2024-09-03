import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { designMasterDialogComponent } from '../../../design-master/design-master.component';

@Component({
  selector: 'app-order-list-dialog',
  templateUrl: './order-list-dialog.component.html',
  styleUrls: ['./order-list-dialog.component.scss']
})
export class OrderListDialogComponent {

  orderForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,

    public dialogRef: MatDialogRef<OrderListDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
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
  }

  formBuild() {
    this.orderForm = this.fb.group({
      party: [''],
      order: [''],
      khata: [''],
      date: new Date(),
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      party: this.orderForm.value.party,
      order: this.orderForm.value.order,
      khata: this.orderForm.value.khata,
      date: this.orderForm.value.date
    }
    this.dialogRef.close({ event: this.action, data: payload });

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
