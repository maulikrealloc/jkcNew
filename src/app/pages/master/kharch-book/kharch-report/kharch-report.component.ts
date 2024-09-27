import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

const khataList = [
  {
    id: 1,
    unitName: 'Demo',
    kharchName: 'demo',
    Dec: 'demo',
    Date: '02/21/2022',
    chalanNo: '12',
    amount: '9999'
  }
];
@Component({
  selector: 'app-kharch-report',
  templateUrl: './kharch-report.component.html',
  styleUrls: ['./kharch-report.component.scss']
})
export class KharchReportComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);


  kharchReportColumns: string[] = [
    '#',
    'unitname',
    'kharchname',
    'dec',
    'date',
    'chalanno',
    'amount'
  ];



  khataListdataSource = new MatTableDataSource(khataList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor() { }
  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.khataListdataSource.paginator = this.paginator;

  }

}
