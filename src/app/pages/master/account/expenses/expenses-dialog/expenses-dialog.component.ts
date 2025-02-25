import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-expenses-dialog',
  templateUrl: './expenses-dialog.component.html',
  styleUrls: ['./expenses-dialog.component.scss']
})
  
export class ExpensesDialogComponent implements OnInit {

  expensesForm: FormGroup;
  action: string;
  local_data: any;
  companyAccountList: any = [];

  constructor(
    private fb: FormBuilder, public dialogRef: MatDialogRef<ExpensesDialogComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.expensesData(this.action === 'Edit' ? this.local_data : undefined);
    this.getCompanyAccountData();
  }

  expensesData(data:any) {
    this.expensesForm = this.fb.group({
      expensesType: [data? data?.expensesType : '', Validators.required],
      paidBy: [data ? data?.paidBy : '', Validators.required],
      date: [data ? this.convertTimestampToDate(data?.date) : new Date()],
      description: [data ? data?.description : '', Validators.required],
      chalanNo: [data ? data?.chalanNo : '', Validators.required],
      amount: [data ? data?.amount : '', Validators.required],
      status: [data ? data?.status : '', Validators.required]
    })
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }

  doAction(): void {
    const payload = this.expensesForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}