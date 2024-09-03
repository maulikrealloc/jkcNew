import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-absent-dialog',
  templateUrl: './absent-dialog.component.html',
  styleUrls: ['./absent-dialog.component.scss']
})
export class AbsentDialogComponent {

  absentForm: FormGroup;
  local_data: any;
  action: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AbsentDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.absentForm.controls['employeeList'].setValue(this.local_data.employeeList)
      this.absentForm.controls['day'].setValue(this.local_data.day)
      this.absentForm.controls['date'].setValue(this.local_data.date)
    }
  }
  buildForm() {
    this.absentForm = this.fb.group({
      employeeList: [''],
      day: new Date(),
      date: ['']
    })
  }

  doAction() {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      employeeList: this.absentForm.value.employeeList,
      day: this.absentForm.value.day,
      date: this.absentForm.value.date
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
