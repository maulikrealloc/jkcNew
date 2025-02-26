import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AbsentDialogComponent } from './absent-dialog/absent-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})

export class AttendanceComponent implements OnInit {

  dateAttendanceForm: FormGroup;
  absentDataColumns: string[] = ['#','employee','day','date','action'];

  attendanceList: any = [];
  employeesList: any = [];
  attendanceListDataSource = new MatTableDataSource(this.attendanceList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService: CommonService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateAttendanceForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });
    this.getAttendanceData();
    this.getEmployeeData();
    this.attendanceListDataSource.paginator = this.paginator;
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  applyFilter(filterValue: string): void {
    this.attendanceListDataSource.filter = filterValue.trim().toLowerCase();
  }

  getAttendanceData() {
    this.commonService.fetchData('AttendanceList', this.attendanceList, this.attendanceListDataSource);
  }

  getEmployeeData() {
    this.commonService.fetchData('EmployeeList', this.employeesList);
  }

  getEmployeeName(employeeId: string): string {
    return this.employeesList.find((employeeObj: any) => employeeObj.id === employeeId)?.firstName
  }

  openAbsent(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AbsentDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'AttendanceList').then(() => this.getAttendanceData()).catch(console.error);
      }
    });
  }

}