import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-income-data',
  templateUrl: './income-data.component.html',
  styleUrls: ['./income-data.component.scss']
})
export class IncomeDataComponent implements OnInit {
  displayedColumns: string[] = [
    'partyName',
    'totalAmount'
  ]

  incomeData: any = []

  dataSource = new MatTableDataSource(this.incomeData)
  constructor(){}
  ngOnInit(): void {}

}
