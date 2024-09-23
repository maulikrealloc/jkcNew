import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WithdrawalListDialogComponent } from './withdrawal-list-dialog/withdrawal-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';


export interface withdrawalData {
  id: number,
  employeeList: string,
  amount: string,
  date: string,
}

@Component({
  selector: 'app-withdrawal-list',
  templateUrl: './withdrawal-list.component.html',
  styleUrls: ['./withdrawal-list.component.scss']
})
export class WithdrawalListComponent {
  dateWithdrawalForm: FormGroup

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  displayedColumns: string[] = [
    '#',
    'employee',
    'amount',
    'date',
    'action',
  ];

  withdrawalList: any = [];

  dataSource = new MatTableDataSource(this.withdrawalList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateWithdrawalForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(WithdrawalListDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.withdrawalList.push({
          id: this.withdrawalList.length + 1,
          employeeList: result.data.employeeList,
          amount: result.data.amount,
          date: result.data.date
        })
        this.dataSource = new MatTableDataSource(this.withdrawalList);
      }
      if (result.event === 'Edit') {
        this.withdrawalList.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.employeeList = result.data.employeeList
            element.amount = result.data.amount
            element.date = result.data.date
          }
        });
        this.dataSource = new MatTableDataSource(this.withdrawalList);
      }
      if (result.event === 'Delete') {
        const allEmployeesData = this.withdrawalList
        this.withdrawalList = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.withdrawalList);
      }
    });
  }
}
