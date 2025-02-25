import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-income-dialog',
  templateUrl: './income-dialog.component.html',
  styleUrls: ['./income-dialog.component.scss']
})
  
export class IncomeDialogComponent implements OnInit {

  incomeForm: FormGroup;
  action: string;
  local_data: any;
  companyAccountList: any = [];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<IncomeDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.incomegroup(this.action === 'Edit' ? this.local_data : undefined);
    this.getCompanyAccountData();
  }

  incomegroup(data:any) {
    this.incomeForm = this.fb.group({
      partyName: [data ? data?.partyName : '', Validators.required],
      account: [data ? data?.account : '', Validators.required],
      invoiceNo: [data ? data?.invoiceNo : '', Validators.required],
      invoiceDate: [data ? this.convertTimestampToDate(data?.invoiceDate): new Date()],
      creditDate: [data ? this.convertTimestampToDate(data?.invoiceDate) : new Date()],
      amount: [data ? data?.amount : '', Validators.required]
    })
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  doAction() {
    const payload = this.incomeForm.value
    this.dialogRef.close({ event: this.action, data: payload })
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }

  closeDialog() {
    this.dialogRef.close({ event: 'cancel' })
  }

}