import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';


const report = [
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


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {


  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  reportColumns: string[] = [
    '#',
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
    // 'action',
  ];


  reportDataSource = new MatTableDataSource(report);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.reportDataSource.paginator = this.paginator;

  }


}
