import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-paid-by-data',
  templateUrl: './paid-by-data.component.html',
  styleUrls: ['./paid-by-data.component.scss']
})
export class PaidByDataComponent implements OnInit {
  displayedColumns: string[] = [
    'paidBy',
    'totalAmount'
  ]

  PaidByData: any = [
    {
      paidBy:'abc',
      totalAmount:3400
    }
  ]

  dataSource = new MatTableDataSource(this.PaidByData)
  constructor(){}
  ngOnInit(): void {}

}
