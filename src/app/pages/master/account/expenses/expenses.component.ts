import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExpensesDialogComponent } from './expenses-dialog/expenses-dialog.component';
import { ExpensesmasterDialogComponent } from './expensesmaster-dialog/expensesmaster-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { log } from 'console';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  expensesColumns: string[] = [
    '#',
    'expensesType',
    'date',
    'description',
    'chalanNo',
    'amount',
    'paidBy',
    'status',
    'action',
  ];

  expenses:any =[]

  dataSource = new MatTableDataSource(this.expenses);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadBillData()
  }
  
  openExpenses(action: string, obj: any){
    obj.action = action;
    const dialogRef = this.dialog.open(ExpensesDialogComponent,{
      data: obj,
    })
    dialogRef.afterClosed().subscribe((result) =>{
      if(result.event === 'Add'){
        this.expenses.push({
          id:this.expenses.length + 1,
          expensesType:result.data.expensesType,
          date:result.data.date,
          description:result.data.description,
          chalanNo:result.data.chalanNo,
          amount:result.data.amount,
          paidBy:result.data.paidBy,
          status:result.data.status
        })
        this.updateDataStorage()
      }
      if(result.event === 'Edit'){
        this.expenses.forEach((value : any) => {
          if(value.id === result.data.id){
            value.id = result.data.id;
            value.expensesType = result.data.expensesType;
            value.date = result.data.date;
            value.description = result.data.description;
            value.chalanNo = result.data.chalanNo;
            value.amount = result.data.amount;
            value.paidBy = result.data.paidBy;
            value.status = result.data.status;
          }
        })
        this.updateDataStorage()
      }
      if(result.event === 'Delete'){
        const expensesData = this.expenses
        this.expenses = expensesData.filter((id:any) => id.id !== result.data.id)
        this.updateDataStorage()
       }
    })
  }

  openexpensesmaster(){
    const dialogRef = this.dialog.open(ExpensesmasterDialogComponent,{

    })
  }

  private updateDataStorage(){
    this.dataSource = new MatTableDataSource(this.expenses);
    localStorage.setItem('expensesnewdata',JSON.stringify(this.expenses));
  }

  private loadBillData(){
    const savedData = localStorage.getItem('expensesnewdata');
    if(savedData){
    this.expenses = JSON.parse(savedData)
    this.dataSource = new MatTableDataSource(this.expenses);
    }   
  }
}
