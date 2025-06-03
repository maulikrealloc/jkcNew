import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExpensesDialogComponent } from './expenses-dialog/expenses-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
  
export class ExpensesComponent implements OnInit {

  expensesDataColumns: string[] = ['#','expensesType','date','description','chalanNo','amount','paidBy','status','action' ];
  expensesList: any = [];
  companyAccountList: any = [];
  expensesmasterList: any = [];
  expenses: any = []
  dateExpensesForm: FormGroup;
  expensesListArr: any =[];
  selectedPaibyId: any;

  expensesListDataSource = new MatTableDataSource(this.expensesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private dialog: MatDialog, private commonService : CommonService) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateExpensesForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });
    this.getExpensesListData();
    this.getCompanyAccountData();
    this.getExpensesmasterListData();
    this.expensesListDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.expensesListDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDate() {
    if (!this.expensesList) return;
    const startDate = this.dateExpensesForm.value.start ? new Date(this.dateExpensesForm.value.start) : null;
    const endDate = this.dateExpensesForm.value.end ? new Date(this.dateExpensesForm.value.end) : null;
    if (startDate && endDate) {
      this.expensesListDataSource.data = this.expensesList.filter((expenses: any) => {
        if (!expenses.date) return false;

        const expensesDate = new Date(expenses.date.seconds * 1000);
        expensesDate.setHours(0, 0, 0);
        return expensesDate >= startDate && expensesDate <= endDate;
      });
    } else {
      this.expensesListDataSource.data = this.expensesList;
    }
  }

  filterData() {
    this.expensesListDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        data.srNo || '',
        data.expensesType || '',
        data.description || '',
        data.chalanNo || '',
        data.date || '',
        data.paidBy || '',
        data.status || '',
        data.amount ||''
      ].join(' ').toLowerCase();

      return dataStr.includes(filter.trim().toLowerCase());
    };
    this.filterDate()
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList, this.expensesListDataSource).then((res) => {
      if (this.expensesList.length > 0)
        this.expensesListArr = this.expensesList;
      this.filterData();
    });
  }

  getExpensesmasterListData() {
    this.commonService.fetchData('ExpensesmasterList', this.expensesmasterList);
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }

  paidbyChange(event: any) {
    this.expensesList = this.expensesListArr;  
    this.selectedPaibyId = event.value;

    const paidbylist = this.expensesList.filter((paidbyObj: any) => paidbyObj.paidBy === this.selectedPaibyId)
    this.expensesList =paidbylist;
    this.expensesListDataSource.paginator = this.paginator;
    this.filterDate();
  }

  openExpenses(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(ExpensesDialogComponent, {
      data: obj,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'ExpensesList').then(() => this.getExpensesListData()).catch(console.error);
      }
    });  
  }

  // openExpensesMaster(action: string, obj: any) {
  //   obj.action = action;
  //   const dialogRef = this.dialog.open(ExpensesmasterDialogComponent, {
  //     data: obj,
  //   })
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result?.event) {
  //       this.commonService.commonApiCalled(result, obj, 'ExpensesmasterList').then(() => this.getExpensesmasterListData()).catch(console.error);
  //     }
  //   });  
  // }
}