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
  KharchList: any = [];
  kharchReportDataColumns: string[] = [ 'srNo', 'unitname', 'kharchname', 'dec', 'date', 'chalanno', 'amount' ];
  totalAmount: number = 0;
  kharchListDataSource = new MatTableDataSource(this.KharchList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService:CommonService) { }

  ngOnInit(): void {
    this.kharchReportForm()
    this.getKharchData();
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
  
  applyFilter(filterValue: string): void {
    this.kharchListDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterDate() {
    if (!this.KharchList) return;
    const startDate = this.dateKharchReportListForm.value.start ? new Date(this.dateKharchReportListForm.value.start) : null;
    const endDate = this.dateKharchReportListForm.value.end ? new Date(this.dateKharchReportListForm.value.end) : null;
    if (startDate && endDate) {
      this.kharchListDataSource.data = this.KharchList.filter((invoice: any) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date.seconds * 1000);
        return invoiceDate >= startDate && invoiceDate <= endDate;
        
      });
    } else {
      this.kharchListDataSource.data = this.KharchList;
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
 
  getKharchData() {
    this.commonService.fetchData('KharchList', this.KharchList, this.kharchListDataSource).then(() => {
      this.kharchListDataSource.data = [...this.KharchList]; 
      this.calculateTotalAmount(); 
    });
  }

}