import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-expenses-data',
  templateUrl: './expenses-data.component.html',
  styleUrls: ['./expenses-data.component.scss']
})
export class ExpensesDataComponent implements OnInit {

  expensesDataColumns: string[] = [
    'expensesType',
    'paymentType',
    'totalAmount',
  ];
  expensesList: any = [];
  pendingTotal: number = 0;
  paidTotal: number = 0;
  expensesListDataSource = new MatTableDataSource(this.expensesList);

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getExpensesListData();
  }

  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList, this.expensesListDataSource).then((data) => {
      this.pendingTotal = this.expensesList.filter((expenseObj: any) => expenseObj.status === 'pending').reduce((amount: number, expenseObj: any) => amount + (expenseObj.amount || 0), 0);
      this.paidTotal = this.expensesList.filter((expenseObj: any) => expenseObj.status === 'paid').reduce((amount: number, expenseObj: any) => amount + (expenseObj.amount || 0), 0);
    })
  }

}