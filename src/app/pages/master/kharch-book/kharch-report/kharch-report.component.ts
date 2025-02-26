import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
@Component({
  selector: 'app-kharch-report',
  templateUrl: './kharch-report.component.html',
  styleUrls: ['./kharch-report.component.scss']
})

export class KharchReportComponent implements OnInit {

  @Input() KharchReportList: any[] = [];

  dateKharchReportListForm: FormGroup;
  KharchReportData: any = [];
  kharchReportDataColumns: string[] = [ 'srNo', 'unitname', 'kharchname', 'dec', 'date', 'chalanno', 'amount' ];
  totalAmount: number = 0;
  kharchListDataSource = new MatTableDataSource(this.KharchReportData);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateKharchReportListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.updateDataSource();
    this.calculateTotalAmount();
    this.kharchListDataSource.paginator = this.paginator;
  }

  ngOnChanges(): void {
    this.updateDataSource();
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    this.totalAmount = this.KharchReportList.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);
  }

  applyFilter(filterValue: string): void {
    this.kharchListDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  private updateDataSource() {
    this.kharchListDataSource = new MatTableDataSource(this.KharchReportList);
  }

}