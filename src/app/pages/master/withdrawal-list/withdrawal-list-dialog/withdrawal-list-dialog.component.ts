import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-withdrawal-list-dialog',
  templateUrl: './withdrawal-list-dialog.component.html',
  styleUrls: ['./withdrawal-list-dialog.component.scss']
})

export class WithdrawalListDialogComponent implements OnInit {

  withdrawalForm: FormGroup;
  action: string;
  local_data: any;
  employeesList: any = [];

  constructor(
    private fb: FormBuilder, public dialogRef: MatDialogRef<WithdrawalListDialogComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action
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

  buildForm(data :any) {
    this.withdrawalForm = this.fb.group({
      employeeList: [data ? data?.employeeList : '', Validators.required],
      amount: [data ? data?.amount : '', Validators.required],
      date: [data ? this.convertTimestampToDate(this.local_data.date) : new Date()]
    })
  }

  doAction() {
    const payload = this.withdrawalForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  getEmployeeData() {
    this.commonService.fetchData('EmployeeList', this.employeesList);
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}