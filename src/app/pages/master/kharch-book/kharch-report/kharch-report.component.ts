import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
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
  kharchReportDataColumns: string[] = ['srNo', 'expensesType', 'paidBy', 'dec', 'date', 'chalanno', 'amount' ];
  totalAmount: number = 0;
  kharchListDataSource = new MatTableDataSource(this.expensesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService:CommonService) { }

  ngOnInit(): void {
    this.kharchReportForm()
    this.getExpensesListData();
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
    if (event.value === 'All') {
      this.kharchListDataSource = new MatTableDataSource(this.expensesList);
    } else {
      const paidbylist = this.expensesList.filter((paidbyObj: any) => paidbyObj.paidBy === event.value);
      this.kharchListDataSource = new MatTableDataSource(paidbylist);
    }

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
        return invoiceDate >= startDate && invoiceDate <= endDate;
        
      });
    } else {
      this.kharchListDataSource.data = this.expensesList;
    }
    this.calculateTotalAmount()
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  calculateTotalAmount() {
    this.totalAmount = this.kharchListDataSource.data.reduce((sum:number, item:any) => sum + (item.amount || 0), 0);
  }
 
  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList).then(() => {
      this.kharchListDataSource.data = [...this.expensesList];
      this.calculateTotalAmount();
    });
  }


  

}