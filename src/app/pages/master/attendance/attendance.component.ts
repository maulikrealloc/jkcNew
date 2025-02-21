import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AbsentDialogComponent } from './absent-dialog/absent-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})

export class AttendanceComponent implements OnInit {

  dateAttendanceForm: FormGroup;
  absentDataColumns: string[] = [
    '#',
    'employee',
    'day',
    'date',
    'action',
  ];

  attendanceList: any = [];
  employeesList: any = [];
  attendanceListDataSource = new MatTableDataSource(this.attendanceList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService) { }

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
    this.firebaseCollectionService.getDocuments('CompanyList', 'AttendanceList').then((attendance) => {
      this.attendanceList = attendance
      if (attendance && attendance.length > 0) {
        this.attendanceListDataSource = new MatTableDataSource(this.attendanceList);
      } else {
        this.attendanceList = [];
        this.attendanceListDataSource = new MatTableDataSource(this.attendanceList);
      }
    }).catch((error) => {
      console.error('Error fetching attendance:', error);
    });
  }

  getEmployeeData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'EmployeeList').then((employee) => {
      this.employeesList = employee
    }).catch((error) => {
      console.error('Error fetching employee:', error);
    });
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
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'AttendanceList');
        this.getAttendanceData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'AttendanceList');
        this.getAttendanceData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'AttendanceList');
        this.getAttendanceData();
      }
    });
  }

}