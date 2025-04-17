import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.scss']
})
  
export class EmployeeReportComponent implements OnInit {

  dateEmployeeForm: FormGroup;
  employeeMasterColumns: string[] = ['#','name','salary','day','absent','upad','extra','remain','bonus','finalAMT' ];
  employeeReportList: any = [];
  employeesList: any = [];
  attendanceList: any = [];
  bonusList: any = [];
  withdrawalList: any = [];
  machineSalaryList: any = [];
  employeeListDataSource = new MatTableDataSource(this.employeeReportList);
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
    this.getEmployeeReport();
    this.employeeListDataSource.paginator = this.paginator;
    setTimeout(() => {
    }, 2000);
  }

  applyFilter(filterValue: string): void {
    this.employeeListDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDate() {
    if (!this.employeeReportList) return;
    const startDate = this.dateEmployeeForm.value.start ? new Date(this.dateEmployeeForm.value.start) : null;
    const endDate = this.dateEmployeeForm.value.end ? new Date(this.dateEmployeeForm.value.end) : null;
    if (startDate && endDate) {
      this.employeeListDataSource.data = this.employeeReportList.filter((invoice: any) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date.seconds * 1000);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else {
      this.employeeListDataSource.data = this.employeeReportList;
    }
  }

  getEmployeeReport() {
    forkJoin({
      employeeReport: this.commonService.fetchData('employeeReportList', this.employeeReportList),
      employees: this.commonService.fetchData('EmployeeList', this.employeesList),
      attendance: this.commonService.fetchData('AttendanceList', this.attendanceList),
      bonus: this.commonService.fetchData('BonusList', this.bonusList),
      withdrawal: this.commonService.fetchData('WithdrawalList', this.withdrawalList),
      machineSalary: this.commonService.fetchData('MachineSalaryList', this.machineSalaryList)
    }).subscribe(response => {
      this.employeeReportList = [];

      this.employeesList 
      this.attendanceList
      this.bonusList 
      this.withdrawalList 
      this.machineSalaryList 

      this.employeesList.forEach((element: any) => {
        const salary = element.salary || 0;
        const days = element.days || 30;
        const abesent = this.getTotal(this.attendanceList, element.id, 'day');
        const upad = this.getTotal(this.withdrawalList, element.id, 'amount');
        const extra = this.getTotal(this.machineSalaryList, element.id, 'amount');
        const bonus = this.getTotal(this.bonusList, element.id, 'amount');

        const presentDays = days - abesent;
        const perDay = salary / days;
        const total = perDay * presentDays;
        const totalupad = total - upad;
        const remain = totalupad + extra;
        const finalAMT = remain + bonus;
        const obj = {
          name: element.firstName,
          salary: salary,
          day: days,
          abesent: abesent,
          upad: upad,
          extra: extra,
          remain: remain.toFixed(2),
          bonus: bonus,
          finalAMT: finalAMT.toFixed(2),
        };

        this.employeeReportList.push(obj);
      });
      this.employeeListDataSource = new MatTableDataSource(this.employeeReportList);
      this.employeeListDataSource.paginator = this.paginator;

      console.log("employeeReportList", this.employeeReportList);
    }, error => {
      console.error("Error fetching data", error);
    });
  }


  getTotal(list: any[], empId: any, key: string): number {
    return list
      ?.filter(item => item?.employeeList === empId)
      .reduce((sum, item) => sum + (item?.[key] || 0), 0);
  }

}