import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
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
  selectedkhata: any;

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

  // filterDate() {
  //   if (!this.khataOrderList) return;
  //   const startDate = this.dateKhataReportListForm.value.start ? new Date(this.dateKhataReportListForm.value.start) : null;
  //   const endDate = this.dateKhataReportListForm.value.end ? new Date(this.dateKhataReportListForm.value.end) : null;
  //   if (startDate && endDate) {
  //     this.khataReportDataSource.data = this.khataOrderList.filter((invoice: any) => {
  //       if (!invoice.date) return false;

  //       const invoiceDate = new Date(invoice.date.seconds * 1000);
  //       return invoiceDate >= startDate && invoiceDate <= endDate;
  //     });
  //   } else {
  //     this.khataReportDataSource.data = this.khataOrderList;
  //   }
  // }

  filterDate() {
    if (!this.khataOrderList) return;
    const startDate = this.dateKhataReportListForm.value.start ? new Date(this.dateKhataReportListForm.value.start) : null;
    const endDate = this.dateKhataReportListForm.value.end ? new Date(this.dateKhataReportListForm.value.end) : null;

    let filteredData = this.khataOrderList.filter((invoice: any) => {
      if (!invoice.date || invoice.status !== 'Done') return false;

      const invoiceDate = new Date(invoice.date.seconds * 1000);
      const startCondition = startDate ? invoiceDate >= startDate : true;
      const endCondition = endDate ? invoiceDate <= endDate : true;
      return startCondition && endCondition;
    });

    if (this.selectedkhata) {
      filteredData = filteredData.filter((item: any) => item.khata === this.selectedkhata);
    }

    this.khataReportDataSource.data = this.processData(filteredData);
  }
 
  processData(data: any[]) {
    return data.map(element => {
      element.pTotal = element.productsOrder[0].productPrice * element.productsOrder[0].productQuantity;
      element.kTotal = element.productsOrder[0].khataPrice * element.productsOrder[0].productQuantity;
      element.profit = element.pTotal - element.kTotal;
      return element;
    });
  }

  applyFilter(filterValue: string): void {
    this.khataReportDataSource.filter = filterValue.trim().toLowerCase();
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
    this.filterData()
  }

  filterData() {
    this.khataReportDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        this.getPartyName(data.party)||'',
        this.getOrderNo(data.khata)||'',
        this.getKhataName(data.order)||'',
        data.productsOrder[0]?.productName,
        data.productsOrder[0]?.productkQuantity || '',
        data.productsOrder[0]?.productQuantity || '',
        data.productsOrder[0]?.productPrice || '',
        data.productsOrder[0]?.khataPrice || '',
        data.pTotal || '',
        data.kTotal || '',
        data.profit || '',
      ].join(' ').toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
    this.filterDate()
  }
  
  getKhataOrderData() {
    this.commonService.fetchData('KhataOrderList', this.khataOrderList).then((data:any) => {
      const processedData = this.processData([...this.khataOrderList]);
      this.khataReportDataSource.data = processedData.filter(item => item.status === 'Done');
      this.filterDate();
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
    this.selectedkhata = event.value;
    //   const khata = this.khataOrderList.filter((khataobj: any) => khataobj.khata === event.value)
    //   this.khataReportDataSource = new MatTableDataSource(khata);
    // this.khataReportDataSource.paginator = this.paginator; 
    this.filterDate();
    }

  filedownload() {
    const doc: any = new jsPDF();
    doc.setFontSize(13);

    const khataName = this.selectedkhata
      ? (this.khataList.find((k: any) => k.id === this.selectedkhata)?.companyName || '')
      : 'All Khata';
    
    const startDate = this.dateKhataReportListForm.value.start;
    const endDate = this.dateKhataReportListForm.value.end;

    const formattedStart = new Date(startDate).toLocaleDateString('en-GB');
    const formattedEnd = new Date(endDate).toLocaleDateString('en-GB');

    doc.text(`Firm: ${khataName}`, 14, 15);
    doc.text(`Report Date: ${formattedStart} To ${formattedEnd}`, 14, 23);

    const filteredData = this.khataReportDataSource.data;
    console.log(this.khataReportDataSource.data);

    const totalAmount = filteredData.reduce((sum: number, item: any) => sum + parseFloat(item.profit || 0), 0);
    doc.text(`Total Amount: - ${Math.round(totalAmount).toFixed(2)}`, 145, 15);

    const headers = [
      "Sr No",
      "Party Name",
      "Party Order",
      "Khata Name",
      "Item Name",
      "K-Quantity",
      "K-Price",
      "P-Total",
      "K-Total",
      "Profit",
    ];

    const data = filteredData.map((item: any, i: number) => {
      const party = this.partyList.find((p: any) => p.id === item.party)?.firstName || '';
      const order = this.orderList.find((p: any) => p.id === item.order)?.partyOrder || '';
      const khata = this.khataList.find((p: any) => p.id === item.khata)?.companyName || '';
      const product = item.productsOrder[0];
      return [
        i + 1,
        party,
        order,
        khata,
        product.productName,
        product.productQuantity,
        product.khataPrice,
        item.pTotal,
        item.kTotal,
        Math.round(item.profit).toFixed(2)
      ];
    });

    const MIN_ROWS = 32;
    if (data.length < MIN_ROWS) {
      for (let idx = data.length; idx < MIN_ROWS; idx++) {
        data.push([
          idx + 1,
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ]);
      }
    }

    doc.setFontSize(10);

    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 187, 0],
        textColor: [8, 8, 8],
        fontStyle: 'bold'
      },
      styles: {
        textColor: [8, 8, 8],
        fontSize: 9,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left' }
      }
    });

    doc.save(`Kharch_Report_${formattedStart.replace(/\//g, '-')}_to_${formattedEnd.replace(/\//g, '-')}.pdf`);
  }
}