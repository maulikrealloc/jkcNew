import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WithdrawalListDialogComponent } from './withdrawal-list-dialog/withdrawal-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
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
    this.withdrawalDataSource.paginator = this.paginator;
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
    this.firebaseCollectionService.getDocuments('CompanyList', 'WithdrawalList').then((withdrawal) => {
      this.withdrawalList = withdrawal
      if (withdrawal && withdrawal.length > 0) {
        this.withdrawalDataSource = new MatTableDataSource(this.withdrawalList);
        this.withdrawalDataSource.filterPredicate = (data: any, filter: string) => {
          const employeeName = this.getEmployeeName(data.employeeId) || '';
          const withdrawalDate = this.convertTimestampToDate(data.date)?.toLocaleDateString() || '';
          const amount = data.amount || '';
          const dataStr = `
          ${employeeName}
          ${withdrawalDate}
          ${amount}
        `.toLowerCase();
          return dataStr.includes(filter.toLowerCase());
        };
      } else {
        this.withdrawalList = [];
        this.withdrawalDataSource = new MatTableDataSource(this.withdrawalList);
      }
    }).catch((error) => {
      console.error('Error fetching withdrawal:', error);
    });
  }

  getEmployeeData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'EmployeeList').then((employee) => {
      this.employeesList = employee
      console.log(this.employeesList, 'empppppppppppppppppp');

    }).catch((error) => {
      console.error('Error fetching employee:', error);
    });
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
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'WithdrawalList');
        this.getWithdrawalData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'WithdrawalList');
        this.getWithdrawalData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'WithdrawalList');
        this.getWithdrawalData();
      }
    });
  }

}   