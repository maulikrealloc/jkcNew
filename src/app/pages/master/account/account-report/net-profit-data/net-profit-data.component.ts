import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-net-profit-data',
  templateUrl: './net-profit-data.component.html',
  styleUrls: ['./net-profit-data.component.scss']
})
export class NetProfitDataComponent {
  netProfitDataColumns: string[] = [
    'totalIncome',
    'totalExpenses',
    'netProfit'
  ]

  netProfitData: any = []

  dataSource = new MatTableDataSource(this.netProfitData)

  constructor() { }

  ngOnInit(): void { }
}