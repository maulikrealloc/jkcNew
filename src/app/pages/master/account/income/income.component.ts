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

  incomeColumns: string[] = [
    '#',
    'partyName',
    'account',
    'invoiceNo',
    'invoiceDate',
    'creditDate',
    'amount',
    'action',
  ];

  income:any =[]

  dataSource = new MatTableDataSource(this.income);

  constructor(private dialog: MatDialog){}

  ngOnInit(): void {
    this.loadBillData()
  }


  openaddIncome(action:string, obj:any){
    obj.action = action;
    const dialogRef = this.dialog.open(IncomeDialogComponent,{
      data : obj
    })
    dialogRef.afterClosed().subscribe((result) =>{
      if(result.event === 'Add'){
        this.income.push({
          id:this.income.length + 1,
          partyName:result.data.partyName,
          account:result.data.account,
          invoiceNo:result.data.invoiceNo,
          invoiceDate:result.data.invoiceDate,
          creditDate:result.data.creditDate,
          amount:result.data.amount
        })
        this.updateDataStorage()
      }
      if(result.event === 'Edit'){
        this.income.forEach((value : any) => {
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
        this.updateDataStorage()
      }
      if(result.event === 'Delete'){
        const allincomeData = this.income
        this.income = allincomeData.filter((id:any) => id.id !== result.data.id)
        this.updateDataStorage()
      }
    })
  }

  openTransfer(){
    const dialogRef = this.dialog.open(TransferDialogComponent,{})
  }

  private updateDataStorage(){
    this.dataSource = new MatTableDataSource(this.income);
    localStorage.setItem('incomedatanewdata',JSON.stringify(this.income));
  }

  private loadBillData(){
    const savedData = localStorage.getItem('incomedatanewdata');
    if(savedData){
    this.income = JSON.parse(savedData)
    this.dataSource = new MatTableDataSource(this.income);
    }
  } 
}