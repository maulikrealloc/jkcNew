import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent implements OnInit {

  dateKhataReportListForm: FormGroup;
  reportDataColumns: string[] = ['srNo','partyName','partyOrder','khataName','itemName','pQuantity','kQuantity','pPrice','kPrice','pTotal','kTotal','profit' ];

  khataReportList: any = [];
  partyList: any = [];
  khataList: any = [];

  khataReportDataSource = new MatTableDataSource(this.khataReportList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService: CommonService, private firebaseCollectionService : FirebaseCollectionService) { }

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
    this.commonService.fetchData('KhataReportList', this.khataReportList, this.khataReportDataSource)
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList)
  }

  getPartyName(party: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === party)?.firstName
  }

  getKhataData() {
    this.commonService.fetchData('KhataList', this.khataList)
  }

  getKhataName(khata: string): string {
    return this.khataList.find((khataObj: any) => khataObj.id === khata)?.companyName
  }

}