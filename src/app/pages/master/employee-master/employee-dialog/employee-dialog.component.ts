import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent implements OnInit {

  employeeForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined);
  }

  formBuild(data:any) {
    this.employeeForm = this.fb.group({
      firstName: [data ? data?.firstName : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: [data ? data?.lastName : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      salary: [data ? data?.salary : '',Validators.required],
      mobileNo: [data ? data?.mobileNo : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      bankName: [data ? data?.bankName : ''],
      ifscCode: [data ? data?.ifscCode : ''],
      bankAccountNo: [data ? data?.bankAccountNo : ''],
    })
  }

  doAction(): void {
    const payload = this.employeeForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}