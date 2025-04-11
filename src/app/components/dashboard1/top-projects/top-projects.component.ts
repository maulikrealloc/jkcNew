import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-top-projects',
  standalone: true,
  imports: [MaterialModule, CommonModule,DatePipe],
  templateUrl: './top-projects.component.html',
})
export class AppTopProjectsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'date', 'amount'];

  InvoiceList: any = [];
  partyList: any = [];
  dataSource = new MatTableDataSource(this.InvoiceList);

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getInvoiceData()
    this.getPartyData()
  }

  getInvoiceData() {
    this.commonService.fetchData('InvoiceList', this.InvoiceList, this.dataSource).then((data) => {
      const currentDate = new Date();
      const currentMonth = new Date().getMonth(); 
      const currentYear = currentDate.getFullYear(); 

      this.InvoiceList = this.InvoiceList.filter((invoice: any) => {
        if (!invoice.paymentDueDate) return false;
        const dueDate = new Date(invoice.paymentDueDate.seconds * 1000);
        return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
      });

      this.dataSource.data = this.InvoiceList; 
    });
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
