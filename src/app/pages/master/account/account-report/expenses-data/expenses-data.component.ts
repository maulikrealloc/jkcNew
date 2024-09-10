import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-expenses-data',
  templateUrl: './expenses-data.component.html',
  styleUrls: ['./expenses-data.component.scss']
})
export class ExpensesDataComponent implements OnInit {
  displayedColumns: string[] = [
    'expensesType',
    'paymentType',
    'totalAmount',
  ]

  expensesData: any = [
    {
      expensesType:'abc',
      paymentType:'abc',
      totalAmount:3400
    }
  ]

  dataSource = new MatTableDataSource(this.expensesData)

  constructor() { }

  ngOnInit(): void { }

}
