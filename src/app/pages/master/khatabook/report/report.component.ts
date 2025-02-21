import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent implements OnInit {

  dateKhataReportListForm: FormGroup;
  reportDataColumns: string[] = [
    'srNo',
    'partyName',
    'partyOrder',
    'khataName',
    'itemName',
    'pQuantity',
    'kQuantity',
    'pPrice',
    'kPrice',
    'pTotal',
    'kTotal',
    'profit',
  ];

  khataReportList: any = [];
  partyList: any = [];
  khataList: any = [];

  khataReportDataSource = new MatTableDataSource(this.khataReportList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dateKhataReportListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.getKhataReportData();
    this.getPartyData();
    this.getKhataData();
    this.khataReportDataSource.paginator = this.paginator;
  }

  getKhataReportData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'KhataReportList').then((khataReport) => {
      this.khataReportList = khataReport
      console.log(this.khataReportList,'khataReportList===================');
      
      if (khataReport && khataReport.length > 0) {
        this.khataReportDataSource = new MatTableDataSource(this.khataReportList);
      } else {
        this.khataReportList = [];
        this.khataReportDataSource = new MatTableDataSource(this.khataReportList);
      }
    }).catch((error) => {
      console.error('Error fetching khataOrder:', error);
    });
  }

  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      this.partyList = party
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  getPartyName(party: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === party)?.firstName
  }

  getKhataData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'KhataList').then((khata) => {
      this.khataList = khata
    }).catch((error) => {
      console.error('Error fetching khata:', error);
    });
  }

  getKhataName(khata: string): string {
    return this.khataList.find((khataObj: any) => khataObj.id === khata)?.companyName
  }

}