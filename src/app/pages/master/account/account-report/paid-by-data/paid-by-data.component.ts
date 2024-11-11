import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-paid-by-data',
  templateUrl: './paid-by-data.component.html',
  styleUrls: ['./paid-by-data.component.scss']
})
export class PaidByDataComponent implements OnInit {
  paidByDataColumns: string[] = [
    'paidBy',
    'totalAmount'
  ]

  PaidByData: any = []

  paidByDataListSource = new MatTableDataSource(this.PaidByData)
  constructor(){}
  ngOnInit(): void {}

}
