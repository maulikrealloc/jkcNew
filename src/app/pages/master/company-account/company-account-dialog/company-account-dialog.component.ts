import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { designMasterDialogComponent } from '../../design-master/design-master.component';
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
    this.formBuild()
    if (this.action === 'Edit') {
      this.companyForm.controls['accountName'].setValue(this.local_data.accountName)
      this.companyForm.controls['bankName'].setValue(this.local_data.bankName)
      this.companyForm.controls['openingBalance'].setValue(this.local_data.openingBalance)
      this.companyForm.controls['date'].setValue(this.convertTimestampToDate(this.local_data.date))
    }
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  formBuild() {
    this.companyForm = this.fb.group({
      accountName: ['', Validators.required],
      bankName: ['', Validators.required],
      openingBalance: ['', Validators.required],
      date: new Date(),
    });
  }

  doAction(): void {
    const payload = {
      accountName: this.companyForm.value.accountName,
      bankName: this.companyForm.value.bankName,
      openingBalance: this.companyForm.value.openingBalance,
      date: this.companyForm.value.date,
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}