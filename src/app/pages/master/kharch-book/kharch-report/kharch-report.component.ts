import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
import moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-kharch-report',
  templateUrl: './kharch-report.component.html',
  styleUrls: ['./kharch-report.component.scss']
})

export class KharchReportComponent implements OnInit {

  dateKharchReportListForm: FormGroup;
  expensesList: any = [];
  companyAccountList: any = [];
  kharchReportDataColumns: string[] = ['srNo', 'expensesType', 'paidBy', 'dec', 'date', 'chalanno', 'amount','status' ];
  totalAmount: number = 0;
  selectedPaidbyId: any ;
  invoicListArr: any =[];
  
  kharchListDataSource = new MatTableDataSource(this.expensesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService:CommonService) { }

  ngOnInit(): void {
    this.getExpensesListData();
    this.kharchReportForm()
    this.getCompanyAccountData()
    this.kharchListDataSource.paginator = this.paginator;
  }

  kharchReportForm() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dateKharchReportListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
  }
  
  paidbyChange(event: any) {
    this.expensesList = this.invoicListArr; 
    this.selectedPaidbyId = event.value;

    if (event.value === 'All') {
      this.kharchListDataSource = new MatTableDataSource(this.expensesList);
    } else {
      const paidbylist = this.expensesList.filter((paidbyObj: any) => paidbyObj.paidBy === this.selectedPaidbyId);
      this.expensesList = paidbylist;
    }
    this.filterDate();

    this.calculateTotalAmount();
    this.kharchListDataSource.paginator = this.paginator;
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }
  
  applyFilter(filterValue: string): void {
    this.kharchListDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDate() {
    if (!this.expensesList) return;
    const startDate = this.dateKharchReportListForm.value.start ? new Date(this.dateKharchReportListForm.value.start) : null;
    const endDate = this.dateKharchReportListForm.value.end ? new Date(this.dateKharchReportListForm.value.end) : null;
    if (startDate && endDate) {
      this.kharchListDataSource.data = this.expensesList.filter((invoice: any) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date.seconds * 1000);
        invoiceDate.setHours(0, 0, 0);
        return invoiceDate >= startDate && invoiceDate <= endDate;
        
      });
    } else {
      this.kharchListDataSource.data = this.expensesList;
    }
    this.calculateTotalAmount();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  calculateTotalAmount() {
    this.totalAmount = this.kharchListDataSource.data.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  }
 
  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList).then((expenses) => {
      if (this.expensesList.length > 0) {
        this.invoicListArr = this.expensesList;
        this.calculateTotalAmount();
        this.filterData();
      }
      // this.kharchListDataSource.data = [...this.expensesList];
    });
  }

  filterData() {
    this.kharchListDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        data.expensesType,
        this.convertTimestampToDate(data.date)?.toLocaleDateString() || '',
        data.description,
        data.chalanNo,
        data.amount || '',
        data.paidBy,
        data.status
      ].join(' ').toLowerCase();

      return dataStr.includes(filter.toLowerCase());
    };
    this.filterDate()
  }

  filedownload() {
    const doc: any = new jsPDF();
    doc.setFontSize(13);

    const startDate = this.dateKharchReportListForm.value.start;
    const endDate = this.dateKharchReportListForm.value.end;

    const formattedStart = new Date(startDate).toLocaleDateString('en-GB');
    const formattedEnd = new Date(endDate).toLocaleDateString('en-GB');

    doc.text(`Report Date: ${formattedStart} To ${formattedEnd}`, 14, 15);

    const filteredData = this.kharchListDataSource.data;

    const totalAmount = filteredData.reduce((sum: number, item: any) => sum + parseFloat(item.amount || 0), 0);
    doc.text(`Total Amount: - ${Math.round(totalAmount).toFixed(2)}`, 145, 15);

    const headers = [
      "Sr No",
      "Date",
      "Chalanno",
      "ExpensesType",
      "PaidBy",
      "Dec",
      "Amount",
      "Status"
    ];

    const data = filteredData.map((item: any, i: number) => {
      const dateStr = item.date?.seconds
        ? moment(item.date.seconds * 1000).format('DD/MM/YYYY')
        : '';
      return [
        i + 1,
        dateStr,
        item.chalanNo,
        item.expensesType,
        item.paidBy,
        item.description,
        Math.round(item.amount).toFixed(2),
        item.status
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
      startY: 25,
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