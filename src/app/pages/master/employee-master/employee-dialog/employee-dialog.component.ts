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
    this.formBuild();
    if (this.action === 'Edit') {
      this.employeeForm.controls['firstName'].setValue(this.local_data.firstName)
      this.employeeForm.controls['lastName'].setValue(this.local_data.lastName)
      this.employeeForm.controls['salary'].setValue(this.local_data.salary)
      this.employeeForm.controls['mobileNo'].setValue(this.local_data.mobileNo)
      this.employeeForm.controls['bankName'].setValue(this.local_data.bankName)
      this.employeeForm.controls['ifscCode'].setValue(this.local_data.ifscCode)
      this.employeeForm.controls['bankAccountNo'].setValue(this.local_data.bankAccountNo)
    }
  }

  formBuild() {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      salary: [''],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      bankName: [''],
      ifscCode: [''],
      bankAccountNo: [''],
    })
  }

  doAction(): void {
    const payload = {
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      salary: this.employeeForm.value.salary,
      mobileNo: this.employeeForm.value.mobileNo,
      bankName: this.employeeForm.value.bankName,
      ifscCode: this.employeeForm.value.ifscCode,
      bankAccountNo: this.employeeForm.value.bankAccountNo
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}