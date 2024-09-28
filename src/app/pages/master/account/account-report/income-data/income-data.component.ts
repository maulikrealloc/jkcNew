import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-income-data',
  templateUrl: './income-data.component.html',
  styleUrls: ['./income-data.component.scss']
})
export class IncomeDataComponent implements OnInit {
  totalAmount: number = 0;
  
  incomeDataColumns: string[] = [
    'partyName',
    'totalAmount'
  ]

  incomeData: any = []

  dataSource = new MatTableDataSource(this.incomeData)

  constructor(){}
 
  ngOnInit(): void { 
    const incomedatanewdata = localStorage.getItem('incomedatanewdata');
    if (incomedatanewdata) {
      const parsed = JSON.parse(incomedatanewdata);
      this.incomeData = parsed;   
      this.dataSource.data = this.incomeData;
    }
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    if (this.incomeData && this.incomeData.length > 0) {
      this.totalAmount = this.incomeData.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0);
    }
  }

}
