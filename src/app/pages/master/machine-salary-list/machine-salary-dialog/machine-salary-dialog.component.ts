import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-machine-salary-dialog',
  templateUrl: './machine-salary-dialog.component.html',
  styleUrls: ['./machine-salary-dialog.component.scss']
})

export class MachineSalaryDialogComponent implements OnInit {

  machineSalaryForm: FormGroup;
  local_data: any;
  action: string;
  employeesList: any = [];

  constructor(
    private fb: FormBuilder, public dialogRef: MatDialogRef<MachineSalaryDialogComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm(this.action === 'Edit' ? this.local_data : undefined)
    this.getEmployeeData();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  buildForm(data:any) {
    this.machineSalaryForm = this.fb.group({
      employeeList: [data ? data?.employeeList : '', Validators.required],
      amount: [data ? data?.amount : '', Validators.required],
      date: [data ? this.convertTimestampToDate(this.local_data.date) : new Date()]
    })
  }

  doAction() {
    const payload = this.machineSalaryForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  getEmployeeData() {
    this.commonService.fetchData('EmployeeList', this.employeesList);
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}