import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-expenses-data',
  templateUrl: './expenses-data.component.html',
  styleUrls: ['./expenses-data.component.scss']
})
export class ExpensesDataComponent implements OnInit {
  pendingTotal: number = 0;
  paidTotal: number = 0;

  expensesDataColumns: string[] = [
    'expensesType',
    'paymentType',
    'totalAmount',
  ]

  expensesList: any = [];
  expensesListDataSource = new MatTableDataSource(this.expensesList);

  constructor(private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getExpensesListData();
   }

  getExpensesListData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'ExpensesList').then((expenses) => {
      this.expensesList = expenses
      if (expenses && expenses.length > 0) {
        this.expensesListDataSource = new MatTableDataSource(this.expensesList);
        this.pendingTotal = this.expensesList.filter((expenseObj: any) => expenseObj.status === 'pending').reduce((amount: number, expenseObj: any) => amount + (expenseObj.amount || 0), 0);
        this.paidTotal = this.expensesList.filter((expenseObj: any) => expenseObj.status === 'paid').reduce((amount: number, expenseObj: any) => amount + (expenseObj.amount || 0), 0);
      }
    }).catch((error) => {
      console.error('Error fetching expenses:', error);
    });
  }

}
