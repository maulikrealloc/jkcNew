import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { IncomeDialogComponent } from './income-dialog/income-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})

export class IncomeComponent implements OnInit {

  incomeDataColumns: string[] = [
    '#',
    'partyName',
    'account',
    'invoiceNo',
    'invoiceDate',
    'creditDate',
    'amount',
    'action',
  ];
  incomeList: any = [];
  companyAccountList: any = [];
  incomeListDataSource = new MatTableDataSource(this.incomeList);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getIncomeListData();
    this.getCompanyAccountData();
  }

  applyFilter(filterValue: string): void {
    this.incomeListDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getIncomeListData() {
    this.commonService.fetchData('IncomeList', this.incomeList, this.incomeListDataSource);
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }

  openIncome(action: string, obj: any) {
    const dialogRef = this.dialog.open(IncomeDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'IncomeList').then(() => this.getIncomeListData()).catch(console.error);
      }
    });
  }

  openTransfer() {
    const dialogRef = this.dialog.open(TransferDialogComponent, {})
  }

}