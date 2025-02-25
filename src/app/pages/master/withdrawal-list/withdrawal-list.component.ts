import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WithdrawalListDialogComponent } from './withdrawal-list-dialog/withdrawal-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
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
  withdrawalDataColumns: string[] = [
    '#',
    'employee',
    'amount',
    'date',
    'action',
  ];
  withdrawalList: any = [];
  employeesList: any = [];
  withdrawalDataSource = new MatTableDataSource(this.withdrawalList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private commonService : CommonService,
    private firebaseCollectionService: FirebaseCollectionService) { }

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

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  applyFilter(filterValue: string): void {
    this.withdrawalDataSource.filter = filterValue.trim().toLowerCase();
  }

  getWithdrawalData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'WithdrawalList')
      .then((withdrawal) => {
        this.withdrawalList = withdrawal || [];
        this.withdrawalDataSource = new MatTableDataSource(this.withdrawalList);
        if (this.withdrawalList.length > 0) this.filterData();
        this.withdrawalDataSource.paginator = this.paginator;
      })
      .catch(error => console.error('Error fetching withdrawal:', error));
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