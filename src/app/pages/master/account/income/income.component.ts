import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { IncomeDialogComponent } from './income-dialog/income-dialog.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  displayedColumns: string[] = [
    '#',
    'partyName',
    'account',
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
      account:'ABC',
      invoiceNo :767,
      invoiceDate :'09/07/24',
      creditDate :'09/07/24',
      amount :8989
    }
  ]

  dataSource = new MatTableDataSource(this.incomedata);

  constructor(private dialog: MatDialog){}

  ngOnInit(): void {}


  openaddIncome(action:string, obj:any){
    obj.action = action;
    const dialogRef = this.dialog.open(IncomeDialogComponent,{
      data : obj
    })
    dialogRef.afterClosed().subscribe((result) =>{
      if(result.event === 'Add'){
        this.incomedata.push({
          id:this.incomedata.length + 1,
          partyName:result.data.partyName,
          account:result.data.account,
          invoiceNo:result.data.invoiceNo,
          invoiceDate:result.data.invoiceDate,
          creditDate:result.data.creditDate,
          amount:result.data.amount
        })
        this.dataSource = new MatTableDataSource(this.incomedata)
      }
      if(result.event === 'Edit'){
        this.incomedata.forEach((value : any) => {
          if(value.id === result.data.id){
            value.id = result.data.id;
            value.partyName = result.data.partyName;
            value.account = result.data.account;
            value.invoiceNo = result.data.invoiceNo;
            value.invoiceDate = result.data.invoiceDate;
            value.creditDate = result.data.creditDate;
            value.amount = result.data.amount;
          }
        })
        this.dataSource = new MatTableDataSource(this.incomedata)
      }
      if(result.event === 'Delete'){
        const allincomeData = this.incomedata
        this.incomedata = allincomeData.filter((id:any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.incomedata)
      }
    })
  }

  openTransfer(){
    const dialogRef = this.dialog.open(TransferDialogComponent,{})
  }

  
}
