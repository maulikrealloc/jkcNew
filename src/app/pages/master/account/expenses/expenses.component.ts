import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExpensesDialogComponent } from './expenses-dialog/expenses-dialog.component';
import { ExpensesmasterDialogComponent } from './expensesmaster-dialog/expensesmaster-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

  expensesDataColumns: string[] = [
    '#',
    'expensesType',
    'date',
    'description',
    'chalanNo',
    'amount',
    'paidBy',
    'status',
    'action',
  ];
  expensesList: any = [];
  companyAccountList: any = [];
  expenses: any = []
  expensesListDataSource = new MatTableDataSource(this.expensesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

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
    this.firebaseCollectionService.getDocuments('CompanyList', 'ExpensesList').then((expenses) => {
      this.expensesList = expenses
      if (expenses && expenses.length > 0) {
        this.expensesListDataSource = new MatTableDataSource(this.expensesList);
      }
    }).catch((error) => {
      console.error('Error fetching expenses:', error);
    });
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

  openExpenses(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(ExpensesDialogComponent, {
      data: obj,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'ExpensesList');
        this.getExpensesListData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'ExpensesList');
        this.getExpensesListData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'ExpensesList');
        this.getExpensesListData();
      }
    });
  }

  openExpensesMaster() {
    const dialogRef = this.dialog.open(ExpensesmasterDialogComponent, {
    })
  }

  private updateDataStorage(){
    this.expensesListDataSource = new MatTableDataSource(this.expenses);
    localStorage.setItem('expensesnewdata',JSON.stringify(this.expenses));
  }

  private loadBillData(){
    const savedData = localStorage.getItem('expensesnewdata');
    if(savedData){
    this.expenses = JSON.parse(savedData)
      this.expensesListDataSource = new MatTableDataSource(this.expenses);
    }   
  }
}