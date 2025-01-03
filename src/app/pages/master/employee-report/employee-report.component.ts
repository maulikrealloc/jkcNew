import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.scss']
})
  
export class EmployeeReportComponent implements OnInit {

  dateEmployeeForm: FormGroup;
  employeeMasterColumns: string[] = [
    '#',
    'name',
    'salary',
    'day',
    'absent',
    'upad',
    'extra',
    'remain',
    'bonus',
    'finalAMT'
  ];

  employeesList: any = [];
  attendanceList: any = [];
  bonusList: any = [];
  employeeListDataSource = new MatTableDataSource(this.employeesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateEmployeeForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });

    this.getEmployeeData();
    this.getAttendanceData();
    this.getBonusData();
    this.employeeListDataSource.paginator = this.paginator;

  }

  getEmployeeData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'EmployeeList').then((employee) => {
      this.employeesList = employee
    }).catch((error) => {
      console.error('Error fetching employee:', error);
    });
  }

  getAttendanceData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'AttendanceList').then((attendance) => {
      this.attendanceList = attendance
    }).catch((error) => {
      console.error('Error fetching attendance:', error);
    });
  }

  getBonusData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'BonusList').then((bonus) => {
      this.bonusList = bonus
    }).catch((error) => {
      console.error('Error fetching bonus:', error);
    });
  }

}