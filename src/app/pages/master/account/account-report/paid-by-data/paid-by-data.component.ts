import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';


@Component({
  selector: 'app-paid-by-data',
  templateUrl: './paid-by-data.component.html',
  styleUrls: ['./paid-by-data.component.scss']
})
export class PaidByDataComponent implements OnInit {

  paidByDataColumns: string[] = [
    'paidBy',
    'totalAmount'
  ];
  expensesList: any = [];
  paidByListDataSource = new MatTableDataSource(this.expensesList);

  constructor(private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getExpensesListData();
  }

  getExpensesListData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'ExpensesList').then((expenses) => {
      this.expensesList = expenses
      if (expenses && expenses.length > 0) {
        this.paidByListDataSource = new MatTableDataSource(this.expensesList);
      }
    }).catch((error) => {
      console.error('Error fetching expenses:', error);
    });
  }

}