import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-expenses-data',
  templateUrl: './expenses-data.component.html',
  styleUrls: ['./expenses-data.component.scss']
})
export class ExpensesDataComponent implements OnInit {
  pendingTotal: number = 0;
  paidTotal: number = 0;

  expensesDataColumns: string[] = [
    'expensesType',
    'paymentType',
    'totalAmount',
  ]

  expensesData: any = []

  dataSource = new MatTableDataSource(this.expensesData)

  constructor() { }

  ngOnInit(): void { 
    const expensessavedData = localStorage.getItem('expensesnewdata');
    if (expensessavedData) {
      const parsedData = JSON.parse(expensessavedData);
      this.expensesData = parsedData;   
      this.dataSource.data = this.expensesData;	
    }
    this.calculateTotalAmount()
  }

  calculateTotalAmount() {
    if (this.expensesData && this.expensesData.length > 0) {
      this.pendingTotal = this.expensesData
        .filter((item: { status: any }) => item.status === 'pending')
        .reduce((acc: any, item: { amount: any }) => acc + item.amount, 0);
      
      this.paidTotal = this.expensesData
        .filter((item: { status: any }) => item.status === 'paid')
        .reduce((acc: any, item: { amount: any }) => acc + item.amount, 0);
    } 
  }

}
