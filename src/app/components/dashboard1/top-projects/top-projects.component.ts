import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-top-projects',
  standalone: true,
  imports: [MaterialModule, CommonModule, DatePipe],
  templateUrl: './top-projects.component.html',
})
export class AppTopProjectsComponent implements OnInit {

  PaymentColumns: string[] = ['name', 'date', 'amount'];
  InvoiceList: any = [];
  partyList: any = [];
  PaymentdataSource = new MatTableDataSource(this.InvoiceList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getInvoiceData();
    this.getPartyData();
    this.PaymentdataSource.paginator = this.paginator;
  }

  // getInvoiceData() {
  //   this.commonService.fetchData('InvoiceList', this.InvoiceList, this.PaymentdataSource).then((data) => {
  //     const currentDate = new Date();
  //     const currentMonth = new Date().getMonth(); 
  //     const currentYear = currentDate.getFullYear();
  //     debugger
  //     this.InvoiceList = this.InvoiceList.filter((invoice: any) => {
  //       if (!invoice.paymentDueDate) return false;
  //       const dueDate = new Date(invoice.paymentDueDate.seconds * 1000);
  //       return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
  //     });

  //     this.PaymentdataSource.data = this.InvoiceList; 
  //   });
  // }
  
  getInvoiceData() {
    this.commonService.fetchData('InvoiceList', this.InvoiceList, this.PaymentdataSource);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    this.InvoiceList = (Array.isArray(this.InvoiceList) ? this.InvoiceList : [])
      .filter((invoice: any) => {
        if (!invoice?.paymentDueDate) return false;

        const dueDate = invoice.paymentDueDate instanceof Timestamp
          ? invoice.paymentDueDate.toDate()
          : new Date(invoice.paymentDueDate.seconds * 1000);

        return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
      });

    this.PaymentdataSource.data = this.InvoiceList;
  }


  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getPartyName(partyId: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyId)?.firstName
  }

}
