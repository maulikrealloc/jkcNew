import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AbsentDialogComponent } from './absent-dialog/absent-dialog.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'employee',
    'day',
    'date',
    'action',
  ];
  employees: any = [
    {
      id: 1,
      employeeList: 'Man',
      day: 'Saturday',
      date: '02/12/2023',
    }
  ];
  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  // generateRandomNumber(min: number, max: number): number {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AbsentDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.employees.push({
          // id:  this.generateRandomNumber(2 , 15),
          id: result.data.length + 1,
          employeeList: result.data.employeeList,
          day: result.data.day,
          date: result.data.date
        })
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result.event === 'Edit') {
        this.employees.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.employeeList = result.data.employeeList
            element.day = result.data.day
            element.date = result.data.date
          }
        });
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result.event === 'Delete') {
        const allEmployeesData = this.employees
        this.employees = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.employees);
      }
    });
  }
}
