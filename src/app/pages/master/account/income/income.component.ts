import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { IncomeDialogComponent } from './income-dialog/income-dialog.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

  displayedColumns: string[] = [
    '#',
    'partyName',
    'invoiceNo',
    'invoiceDate',
    'creditDate',
    'amount',
    'action',
  ];

  incomedata:any =[
    {
      id: 1,
      partyName :'ABC',
      invoiceNo :767,
      invoiceDate :'09/07/24',
      creditDate :'09/07/24',
      amount :8989
    }
  ]

  dataSource = new MatTableDataSource(this.incomedata);
  constructor(private dialog: MatDialog){}

  ngOnInit(): void {}
  openTransfer(){
    const dialogRef = this.dialog.open(TransferDialogComponent,{})
  }
  openaddIncome(){
    const dialogRef = this.dialog.open(IncomeDialogComponent,{})
  }
}
