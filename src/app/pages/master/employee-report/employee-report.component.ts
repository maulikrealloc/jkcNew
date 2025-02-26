import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.scss']
})
  
export class EmployeeReportComponent implements OnInit {

  dateEmployeeForm: FormGroup;
  employeeMasterColumns: string[] = ['#','name','salary','day','absent','upad','extra','remain','bonus','finalAMT' ];

  employeesList: any = [];
  attendanceList: any = [];
  bonusList: any = [];
  employeeListDataSource = new MatTableDataSource(this.employeesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService: CommonService) { }

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
    this.commonService.fetchData('EmployeeList', this.employeesList);
  }

  getAttendanceData() {
    this.commonService.fetchData('AttendanceList', this.attendanceList);
  }

  getBonusData() {
    this.commonService.fetchData('BonusList', this.bonusList);
  }

}