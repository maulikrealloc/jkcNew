import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MachineSalaryDialogComponent } from './machine-salary-dialog/machine-salary-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-machine-salary-list',
  templateUrl: './machine-salary-list.component.html',
  styleUrls: ['./machine-salary-list.component.scss']
})
export class MachineSalaryListComponent {
  dateMachinesalaryForm:FormGroup

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  machineSalaryColumns: string[] = [
    '#',
    'employee',
    'amount',
    'date',
    'action',
  ];

  machineSalaryList: any = [];

  dataSource = new MatTableDataSource(this.machineSalaryList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb:FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); 
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
    
    this.dateMachinesalaryForm = this.fb.group({
      start:[startDate],
      end:[endDate]
    })
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(MachineSalaryDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.machineSalaryList.push({
          id: this.machineSalaryList.length + 1,
          employeeList: result.data.employeeList,
          amount: result.data.amount,
          date: result.data.date
        })
        this.dataSource = new MatTableDataSource(this.machineSalaryList);
      }
      if (result?.event === 'Edit') {
        this.machineSalaryList.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.employeeList = result.data.employeeList
            element.amount = result.data.amount
            element.date = result.data.date
          }
        });
        this.dataSource = new MatTableDataSource(this.machineSalaryList);
      }
      if (result?.event === 'Delete') {
        const allEmployeesData = this.machineSalaryList
        this.machineSalaryList = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.machineSalaryList);
      }
    });
  }
}
