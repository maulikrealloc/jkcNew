import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CompanyAccountDialogComponent } from './company-account-dialog/company-account-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-company-account',
  templateUrl: './company-account.component.html',
  styleUrls: ['./company-account.component.scss']
})

export class CompanyAccountComponent implements OnInit {

  companyAccountDataColumns: string[] = [
    '#',
    'accountName',
    'bankName',
    'openingBalance',
    'date',
    'action',
  ];
  companyAccountList: any = [];
  companyAccountDataSource = new MatTableDataSource(this.companyAccountList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

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
    this.firebaseCollectionService.getDocuments('CompanyList', 'CompanyAccountList').then((company) => {
      this.companyAccountList = company
      if (company && company.length > 0) {
        this.companyAccountDataSource = new MatTableDataSource(this.companyAccountList);
      }
    }).catch((error) => {
      console.error('Error fetching company:', error);
    });
  }

  openCompanyAccount(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(CompanyAccountDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'CompanyAccountList');
        this.getCompanyAccountData()
      }
      if (result.event === 'Edit') {
        this.companyAccountList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'CompanyAccountList');
            this.getCompanyAccountData()
          }
        });
      }
      if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'CompanyAccountList');
        this.getCompanyAccountData()
      }
    });
  }

}