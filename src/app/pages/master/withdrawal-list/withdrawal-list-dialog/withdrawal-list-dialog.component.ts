import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-withdrawal-list-dialog',
  templateUrl: './withdrawal-list-dialog.component.html',
  styleUrls: ['./withdrawal-list-dialog.component.scss']
})
export class WithdrawalListDialogComponent {
  withdrawalForm: FormGroup;
  action: string;
  local_data: any;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WithdrawalListDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.withdrawalForm.controls['employeeList'].setValue(this.local_data.employeeList)
      this.withdrawalForm.controls['amount'].setValue(this.local_data.amount)
      this.withdrawalForm.controls['date'].setValue(this.local_data.date)
    }
  }
  buildForm() {
    this.withdrawalForm = this.fb.group({
      employeeList: [''],
      amount: [''],
      date: new Date()
    })
  }

  doAction() {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      employeeList: this.withdrawalForm.value.employeeList,
      amount: this.withdrawalForm.value.amount,
      date: this.withdrawalForm.value.date
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
