import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { Observable, map, startWith } from 'rxjs';
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
  expensesList: any = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;

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
    this.getExpensesListData();
  }

  initializeAutocomplete() {
    this.filteredOptions = this.expensesForm.controls['expensesType'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const uniqueOptions = [...new Set(this.options)];
    return uniqueOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  checkedValue() {
    const selectedValue = this.expensesForm.controls['expensesType'].value?.trim();
    if (selectedValue && !this.options.includes(selectedValue)) {
      this.options.push(selectedValue);
      this.initializeAutocomplete();
    }
  }

  expensesData(data:any) {
    this.expensesForm = this.fb.group({
      expensesType: [data? data?.expensesType : '', Validators.required],
      paidBy: [data ? data?.paidBy : ''],
      date: [data ? this.convertTimestampToDate(data?.date) : new Date()],
      description: [data ? data?.description : ''],
      chalanNo: [data ? data?.chalanNo : ''],
      amount: [data ? data?.amount : ''],
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
  
  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList).then((res) => {
      this.options =(this.expensesList.map((expense: any) => expense.expensesType));
      this.initializeAutocomplete();
    });
  }


  doAction(): void {
    const payload = this.expensesForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}