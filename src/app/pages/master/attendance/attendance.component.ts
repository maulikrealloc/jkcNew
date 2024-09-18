import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AbsentDialogComponent } from './absent-dialog/absent-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  dateAttendanceForm: FormGroup

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  displayedColumns: string[] = [
    '#',
    'employee',
    'day',
    'date',
    'action',
  ];

  attendance: any = [
    {
      id: 1,
      employeeList: 'Man',
      day: 2,
      date: '02/12/2023',
    }
  ];

  dataSource = new MatTableDataSource(this.attendance);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateAttendanceForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
 

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AbsentDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.attendance.push({
          id: this.attendance.length + 1,
          employeeList: result.data.employeeList,
          day: result.data.day,
          date: result.data.date
        })
        this.dataSource = new MatTableDataSource(this.attendance);
      }
      if (result.event === 'Edit') {
        this.attendance.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.employeeList = result.data.employeeList
            element.day = result.data.day
            element.date = result.data.date
          }
        });
        this.dataSource = new MatTableDataSource(this.attendance);
      }
      if (result.event === 'Delete') {
        const allEmployeesData = this.attendance
        this.attendance = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.attendance);
      }
    });
  }
}
