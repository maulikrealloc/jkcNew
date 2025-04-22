import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
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
  khataOrderList: any = [];
  partyList: any = [];
  khataList: any = [];
  orderList: any = [];
  khataReportDataSource = new MatTableDataSource(this.khataReportList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService: CommonService) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dateKhataReportListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.getKhataOrderData();
    this.getKhataReportData();
    this.getPartyData();
    this.getKhataData();
    this.getOrderData();
    
    this.khataReportDataSource.paginator = this.paginator;  
  }

  filterDate() {
    if (!this.khataOrderList) return;
    const startDate = this.dateKhataReportListForm.value.start ? new Date(this.dateKhataReportListForm.value.start) : null;
    const endDate = this.dateKhataReportListForm.value.end ? new Date(this.dateKhataReportListForm.value.end) : null;
    if (startDate && endDate) {
      this.khataReportDataSource.data = this.khataOrderList.filter((invoice: any) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date.seconds * 1000);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else {
      this.khataReportDataSource.data = this.khataOrderList;
    }
  }
 
  processData(data: any[]) {
    return data.map(element => {
      element.pTotal = element.productsOrder[0].productPrice * element.productsOrder[0].productQuantity;
      element.kTotal = element.productsOrder[0].khataPrice * element.productsOrder[0].productQuantity;
      element.profit = element.pTotal - element.kTotal;
      return element;
    });
  }
  
  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }
  
  getKhataReportData() {
    this.commonService.fetchData('KhataReportList', this.khataReportList, this.khataReportDataSource)
    this.getKhataOrderData()
  }
  
  getKhataOrderData() {
    this.commonService.fetchData('KhataOrderList', this.khataOrderList).then((data:any) => {
      this.khataReportDataSource.data = this.processData([...this.khataOrderList]); 
    });
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

  getOrderData() {
    this.commonService.fetchData('OrderList', this.orderList);
  }

  getOrderNo(order: string): string {
    return this.orderList.find((orderObj: any) => orderObj.id === order)?.partyOrder
  }

    KhataChange(event: any) {
      const khata = this.khataOrderList.filter((khataobj: any) => khataobj.khata === event.value)
      this.khataReportDataSource = new MatTableDataSource(khata);
      this.khataReportDataSource.paginator = this.paginator;  
      this.filterDate();
    }

  filedownload(){}
}