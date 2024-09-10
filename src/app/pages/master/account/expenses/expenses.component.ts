import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ExpensesDialogComponent } from './expenses-dialog/expenses-dialog.component';
import { ExpensesmasterDialogComponent } from './expensesmaster-dialog/expensesmaster-dialog.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {

  displayedColumns: string[] = [
    '#',
    'type',
    'date',
    'description',
    'chalanNo',
    'amount',
    'paidBy',
    'status',
    'action',
  ];
  expenses:any =[
    {
      id: 1,
      type :'ABC',
      date :'06/09/24',
      description :'ABC',
      chalanNo :767,
      amount :8989,
      paidBy :'ABC',
      status :'Paid'
    }
  ]

  dataSource = new MatTableDataSource(this.expenses);

  constructor(private dialog: MatDialog) { }
  
  openExpenses(){
    const dialogRef = this.dialog.open(ExpensesDialogComponent,{

    })
  }

  openexpensesmaster(){
    const dialogRef = this.dialog.open(ExpensesmasterDialogComponent,{

    })
  }
}
