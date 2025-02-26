import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExpensesDialogComponent } from './expenses-dialog/expenses-dialog.component';
import { ExpensesmasterDialogComponent } from './expensesmaster-dialog/expensesmaster-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
  
export class ExpensesComponent implements OnInit {

  expensesDataColumns: string[] = ['#','expensesType','date','description','chalanNo','amount','paidBy','status','action' ];
  expensesList: any = [];
  companyAccountList: any = [];
  expenses: any = []
  expensesListDataSource = new MatTableDataSource(this.expensesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService : CommonService) { }

  ngOnInit(): void {
    this.getExpensesListData();
    this.getCompanyAccountData();
    this.expensesListDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.expensesListDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList, this.expensesListDataSource);
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
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

  openExpensesMaster() {
    const dialogRef = this.dialog.open(ExpensesmasterDialogComponent, {
    })
  }
}