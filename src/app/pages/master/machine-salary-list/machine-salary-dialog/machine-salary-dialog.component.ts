import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BonusListDialogComponent } from '../../bonus-list/bonus-list-dialog/bonus-list-dialog.component';

@Component({
  selector: 'app-machine-salary-dialog',
  templateUrl: './machine-salary-dialog.component.html',
  styleUrls: ['./machine-salary-dialog.component.scss']
})
export class MachineSalaryDialogComponent {

  machineSalaryForm: FormGroup;
  local_data: any;
  action: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MachineSalaryDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.machineSalaryForm.controls['employeeList'].setValue(this.local_data.employeeList)
      this.machineSalaryForm.controls['amount'].setValue(this.local_data.amount)
      this.machineSalaryForm.controls['date'].setValue(this.local_data.date)
    }
  }
  buildForm() {
    this.machineSalaryForm = this.fb.group({
      employeeList: ['',Validators.required],
      amount: ['',Validators.required],
      date: new Date(),
    })
  }

  doAction() {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      employeeList: this.machineSalaryForm.value.employeeList,
      amount: this.machineSalaryForm.value.amount,
      date: this.machineSalaryForm.value.date
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
