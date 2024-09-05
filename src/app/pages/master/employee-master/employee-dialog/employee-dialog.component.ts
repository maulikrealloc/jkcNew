import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { designMasterDialogComponent } from '../../design-master/design-master.component';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent {


  employeeForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;

  }
  ngOnInit(): void {
    this.formBuild()
    if (this.action === 'Edit') {
      this.employeeForm.controls['firstName'].setValue(this.local_data.firstName)
      this.employeeForm.controls['lastName'].setValue(this.local_data.lastName)
      this.employeeForm.controls['salary'].setValue(this.local_data.salary)
      this.employeeForm.controls['mobileNo'].setValue(this.local_data.mobileNo)
    }
  }

  formBuild() {
    this.employeeForm = this.fb.group({
      firstName: ['',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: ['',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      salary: ['',Validators.required],
      mobileNo: ['',[Validators.required,Validators.pattern('^[0-9]{10}$')]]
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      salary: this.employeeForm.value.salary,
      mobileNo: this.employeeForm.value.mobileNo,
    }
    this.dialogRef.close({ event: this.action, data: payload });

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
