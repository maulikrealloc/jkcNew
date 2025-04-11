import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-company-account-dialog',
  templateUrl: './company-account-dialog.component.html',
  styleUrls: ['./company-account-dialog.component.scss']
})

export class CompanyAccountDialogComponent implements OnInit {

  companyForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder, public dialogRef: MatDialogRef<CompanyAccountDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined)
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  formBuild(data:any) {
    this.companyForm = this.fb.group({
      accountName: [data ? data?.accountName : '', Validators.required],
      bankName: [data ? data?.bankName : '', Validators.required],
      openingBalance: [data ? data?.openingBalance : '', Validators.required],
      date: [data ? this.convertTimestampToDate(this.local_data.date) : new Date()]
    });
  }

  doAction(): void {
    const payload = this.companyForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}