import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-paid-by-data',
  templateUrl: './paid-by-data.component.html',
  styleUrls: ['./paid-by-data.component.scss']
})
export class PaidByDataComponent implements OnInit {

  paidByDataColumns: string[] = ['paidBy','totalAmount'];
  expensesList: any = [];
  paidByListDataSource = new MatTableDataSource(this.expensesList);

  constructor(private commonService : CommonService) { }

  ngOnInit(): void {
    this.getExpensesListData();
  }

  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList, this.paidByListDataSource).then((res) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const currentMonthExpenses = this.expensesList.filter((expense:any) => {
        const expenseDate = new Date(expense.date.seconds * 1000);

        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });

      console.log("Current month paidByListDataSource:", currentMonthExpenses);
      this.paidByListDataSource = new MatTableDataSource (currentMonthExpenses)
    });
  }

}