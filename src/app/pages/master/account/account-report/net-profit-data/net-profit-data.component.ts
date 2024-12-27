import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-net-profit-data',
  templateUrl: './net-profit-data.component.html',
  styleUrls: ['./net-profit-data.component.scss']
})
export class NetProfitDataComponent implements OnInit {

  netProfitDataColumns: string[] = [
    'totalIncome',
    'totalExpenses',
    'netProfit'
  ]

  netProfitData: any = [];
  expensesList: any = [];
  incomedataList: any = [];

  netProfitListDataSource = new MatTableDataSource(this.netProfitData);

  constructor(private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void { 
    this.getExpensesListData();
    this.getIncomeListData();
  }

  getExpensesListData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'ExpensesList').then((expenses) => {
      if (expenses && expenses.length > 0) {
        this.expensesList = expenses
        console.log('expensesList============>>>>>>>>>>>', this.expensesList);
      }
    }).catch((error: any) => {
      console.error('Error fetching expenses:', error);
    });
  }

  getIncomeListData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'IncomeList').then((income) => {
      if (income && income.length > 0) {
        this.incomedataList = income
        console.log('incomedataList============>>>>>>>>>>>',this.incomedataList);
      }
    }).catch((error: any) => {
      console.error('Error fetching income:', error);
    });
  }

}
