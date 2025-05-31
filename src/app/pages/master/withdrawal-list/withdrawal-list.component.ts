import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WithdrawalListDialogComponent } from './withdrawal-list-dialog/withdrawal-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';
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

export class WithdrawalListComponent implements OnInit {

  dateWithdrawalForm: FormGroup;
  withdrawalDataColumns: string[] = ['#','employee','amount','date','action' ];
  withdrawalList: any = [];
  employeesList: any = [];
  withdrawalDataSource = new MatTableDataSource(this.withdrawalList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private commonService : CommonService,) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateWithdrawalForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.getWithdrawalData();
    this.getEmployeeData();
  }

  ngAfterViewInit() {
    this.withdrawalDataSource.paginator = this.paginator;
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  filterDate() {
    if (!this.withdrawalList) return;
    const startDate = this.dateWithdrawalForm.value.start ? new Date(this.dateWithdrawalForm.value.start) : null;
    const endDate = this.dateWithdrawalForm.value.end ? new Date(this.dateWithdrawalForm.value.end) : null;
    if (startDate && endDate) {
      this.withdrawalDataSource.data = this.withdrawalList.filter((invoice: any) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date.seconds * 1000);
        invoiceDate.setHours(0, 0, 0);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else {
      this.withdrawalDataSource.data = this.withdrawalList;
    }
  }

  applyFilter(filterValue: string): void {
    this.withdrawalDataSource.filter = filterValue.trim().toLowerCase();
  }

  getWithdrawalData() {
    this.commonService.fetchData('WithdrawalList', this.withdrawalList, this.withdrawalDataSource).then((res) => {
      this.filterDate()
    })
  }

  filterData() {
    this.withdrawalDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        this.getEmployeeName(data.employeeId) || '',
        this.convertTimestampToDate(data.date)?.toLocaleDateString() || '',
        data.amount || ''
      ].join(' ').toLowerCase();

      return dataStr.includes(filter.toLowerCase());
    };
  }

  getEmployeeData() {
    this.commonService.fetchData('EmployeeList', this.employeesList);
  }

  getEmployeeName(employeeId: string): string {
    return this.employeesList.find((employeeObj: any) => employeeObj.id === employeeId)?.firstName
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(WithdrawalListDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'WithdrawalList').then(() => this.getWithdrawalData()).catch(console.error); 
      }
    });
  }

}   