import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CompanyAccountDialogComponent } from './company-account-dialog/company-account-dialog.component';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-company-account',
  templateUrl: './company-account.component.html',
  styleUrls: ['./company-account.component.scss']
})

export class CompanyAccountComponent implements OnInit {

  companyAccountDataColumns: string[] = ['#','accountName','bankName','openingBalance','date','action' ];
  companyAccountList: any = [];
  companyAccountDataSource = new MatTableDataSource(this.companyAccountList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService ) { }

  ngOnInit(): void {
    this.getCompanyAccountData();
    this.companyAccountDataSource.paginator = this.paginator;
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  applyFilter(filterValue: string): void {
    this.companyAccountDataSource.filter = filterValue.trim().toLowerCase();
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList, this.companyAccountDataSource);
  }

  openCompanyAccount(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(CompanyAccountDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'CompanyAccountList').then(() => this.getCompanyAccountData()).catch(console.error);
      }
    });
  }

}