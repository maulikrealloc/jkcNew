import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  dateReportListForm: FormGroup;
  report = [
    {
      id: 1,
      partyName: 'Demo',
      partyOrder: 'Test',
      khataName: 2000,
      itemName: 9876543210,
      pQuantity: 9876543210,
      kQuantity: 9876543210,
      pPrice: 9876543210,
      kPrice: 9876543210,
      pTotal: 9876543210,
      kTotal: 9876543210,
      profit: 9876543210
    }
  ];

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  reportColumns: string[] = [
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

  reportDataSource = new MatTableDataSource(this.report);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateReportListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
  }


  ngAfterViewInit(): void {
    this.reportDataSource.paginator = this.paginator;
  }

}