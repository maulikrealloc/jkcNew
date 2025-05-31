import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
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
    const startDate = this.dateEmployeeForm.value.start ? new Date(this.dateEmployeeForm.value.start) : null;
    const endDate = this.dateEmployeeForm.value.end ? new Date(this.dateEmployeeForm.value.end) : null;

    if (!startDate || !endDate) {
      this.employeeListDataSource.data = this.employeeReportList;
      return;
    }

    this.employeeReportList = [];

    this.employeesList.forEach((element: any) => {
      const salary = element.salary || 0;
      const days = element.days || 30;

      const attendanceFiltered = this.attendanceList.filter((item:any) =>
        item.employeeList === element.id && this.checkDateInRange(item.date, startDate, endDate)
      );
      const bonusFiltered = this.bonusList.filter((item:any) =>
        item.employeeList === element.id && this.checkDateInRange(item.date, startDate, endDate)
      );
      const withdrawalFiltered = this.withdrawalList.filter((item:any) =>
        item.employeeList === element.id && this.checkDateInRange(item.date, startDate, endDate)
      );
      const machineSalaryFiltered = this.machineSalaryList.filter((item:any) =>
        item.employeeList === element.id && this.checkDateInRange(item.date, startDate, endDate)
      );

      const abesent = this.getTotal(attendanceFiltered, element.id, 'day');
      const upad = this.getTotal(withdrawalFiltered, element.id, 'amount');
      const extra = this.getTotal(machineSalaryFiltered, element.id, 'amount');
      const bonus = this.getTotal(bonusFiltered, element.id, 'amount');

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
  }

  filterData() {
    this.employeeListDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        data.abesent || 0,
        data.upad || 0,
        data.extra || 0,
        data.bonus || 0,
      ].join(' ').toLowerCase();

      return dataStr.includes(filter.toLowerCase());
    };
    this.filterDate()
  }

  checkDateInRange(dateObj: any, start: Date, end: Date): boolean {
    if (!dateObj || !dateObj.seconds) return false;
    const date = new Date(dateObj.seconds * 1000);
    date.setHours(0, 0, 0);
    return date >= start && date <= end;
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
      this.filterData();
      this.employeeListDataSource = new MatTableDataSource(this.employeeReportList);
      this.employeeListDataSource.paginator = this.paginator;
    }, error => {
      console.error("Error fetching data", error);
    });
  }

  getTotal(list: any[], empId: any, key: string): number {
    return list
      ?.filter(item => item?.employeeList === empId)
      .reduce((sum, item) => sum + (item?.[key] || 0), 0);
  }

  filedownload() {
    const doc: any = new jsPDF();
    doc.setFontSize(13);

    const startDate = this.dateEmployeeForm.value.start;
    const endDate = this.dateEmployeeForm.value.end;

    const formattedStart = new Date(startDate).toLocaleDateString('en-GB');
    const formattedEnd = new Date(endDate).toLocaleDateString('en-GB');

    doc.text(`Report Date: ${formattedStart} To ${formattedEnd}`, 14, 15);

    const totalAmount = this.employeeReportList.reduce((sum: number, item: any) => sum + parseFloat(item.finalAMT), 0);
    doc.text(`Total Amount: - ${totalAmount.toFixed(2)}`, 145, 15);

    const headers = [
      "Name",
      "Salary",
      "Day",
      "Absent",
      "Updated",
      "Extra",
      "Remain",
      "Bonus",
      "Final AMT",
      "Signature"
    ];

    const data = this.employeeReportList.map((item: any) => [
      item.name,
      item.salary.toString(),
      item.day.toString(),
      item.abesent.toString(),
      item.upad.toString(),
      item.extra.toString(),
      item.remain.toString(),
      item.bonus.toString(),
      item.finalAMT.toString(),
      ""
    ]);

    doc.setFontSize(10);

    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 187, 0],
        textColor: [8, 8, 8],
        fontStyle: 'bold'
      },
      styles: {
        textColor:[8, 8, 8],
        fontSize: 9,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left' },
        9: { halign: 'left' }
      }
    });

    doc.save(`Salary_Report_${formattedStart.replace(/\//g, '-')}_to_${formattedEnd.replace(/\//g, '-')}.pdf`);
  }

}