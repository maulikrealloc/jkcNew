import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Logger } from 'sass';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-net-profit-data',
  templateUrl: './net-profit-data.component.html',
  styleUrls: ['./net-profit-data.component.scss']
})
export class NetProfitDataComponent implements OnInit {

  netProfitDataColumns: string[] = [ 'totalIncome', 'totalExpenses', 'netProfit' ];
  netProfitData: any = [];
  expensesList: any = [];
  incomeDataList: any = [];
  netProfitListDataSource = new MatTableDataSource(this.netProfitData);
  totalExpenses: any;
  totalIncome: any;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getExpensesListData();
    this.getIncomeListData();
  }

  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList).then((data) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const currentMonthExpenses = this.expensesList.filter((expense: any) => {
        const expenseDate = new Date(expense.date.seconds * 1000);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });

      console.log("Current month expenses:", currentMonthExpenses);
      this.totalExpenses = currentMonthExpenses.map((id: any) => id.amount).reduce((a: any, b: any) => a + b, 0);

    });
  }

  getIncomeListData() {
    this.commonService.fetchData('IncomeList', this.incomeDataList).then((data) => {
      this.totalIncome = this.incomeDataList?.map((id: any) => id.amount).reduce((a: any, b: any) => a + b,0);
      const totalNetProfit:any = [{ totalExpenses: this.totalExpenses, totalIncome: this.totalIncome, netProfit: this.totalIncome - this.totalExpenses }]
      this.netProfitListDataSource = new MatTableDataSource(totalNetProfit);
    });
  }

}