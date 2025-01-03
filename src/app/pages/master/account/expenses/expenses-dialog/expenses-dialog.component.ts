import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

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
    private firebaseCollectionService: FirebaseCollectionService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.expensesData();
    this.getCompanyAccountData();
    if (this.action === 'Edit') {
      this.expensesForm.controls['expensesType'].setValue(this.local_data.expensesType)
      this.expensesForm.controls['paidBy'].setValue(this.local_data.paidBy)
      this.expensesForm.controls['date'].setValue(this.convertTimestampToDate(this.local_data.date))
      this.expensesForm.controls['description'].setValue(this.local_data.description)
      this.expensesForm.controls['chalanNo'].setValue(this.local_data.chalanNo)
      this.expensesForm.controls['amount'].setValue(this.local_data.amount)
      this.expensesForm.controls['status'].setValue(this.local_data.status)
    }
  }

  expensesData() {
    this.expensesForm = this.fb.group({
      expensesType: ['', Validators.required],
      paidBy: ['', Validators.required],
      date: new Date(),
      description: ['', Validators.required],
      chalanNo: ['', Validators.required],
      amount: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getCompanyAccountData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'CompanyAccountList').then((company) => {
      if (company && company.length > 0) {
        this.companyAccountList = company
      }
    }).catch((error) => {
      console.error('Error fetching company:', error);
    });
  }

  doAction(): void {
    const payload = {
      expensesType: this.expensesForm.value.expensesType,
      paidBy: this.expensesForm.value.paidBy,
      date: this.expensesForm.value.date,
      description: this.expensesForm.value.description,
      chalanNo: this.expensesForm.value.chalanNo,
      amount: this.expensesForm.value.amount,
      status: this.expensesForm.value.status,
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}