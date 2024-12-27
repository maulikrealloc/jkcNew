import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { IncomeDialogComponent } from './income-dialog/income-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  incomeColumns: string[] = [
    '#',
    'partyName',
    'account',
    'invoiceNo',
    'invoiceDate',
    'creditDate',
    'amount',
    'action',
  ];

  incomedataList: any = [];
  companyAccountList: any = [];
  incomeListDataSource = new MatTableDataSource(this.incomedataList);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService){}

  ngOnInit(): void {
    this.getIncomeListData();
    this.getCompanyAccountData();
  }
  
  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getIncomeListData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'IncomeList').then((income) => {
      this.incomedataList = income
      if (income && income.length > 0) {
        this.incomeListDataSource = new MatTableDataSource(this.incomedataList);
      }
    }).catch((error) => {
      console.error('Error fetching income:', error);
    });
  }
  
  getCompanyAccountData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'CompanyAccountList').then((company) => {
      if (company && company.length > 0) {
        this.companyAccountList = company
      }
    }).catch((error) => {
      console.error('Error fetching company:', error);
    });
  }

  openIncome(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(IncomeDialogComponent, {
      data: obj,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'IncomeList');
        this.getIncomeListData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'IncomeList');
        this.getIncomeListData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'IncomeList');
        this.getIncomeListData();
      }
    });
  }

  openTransfer(){
    const dialogRef = this.dialog.open(TransferDialogComponent,{})
  }

}