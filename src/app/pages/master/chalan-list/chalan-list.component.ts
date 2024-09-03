import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-chalan-list',
  templateUrl: './chalan-list.component.html',
  styleUrls: ['./chalan-list.component.scss']
})
export class ChalanListComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'chalanNo',
    'chalanDate',
    'netAmount',
    'action',
  ];

  employees = [
    {
      id: 1,
      chalanNo: '12',
      chalanDate: '02/21/2023',
      netAmount: 2000,
    }
  ];

  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor() { }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
