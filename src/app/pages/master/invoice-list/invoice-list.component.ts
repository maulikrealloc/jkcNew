import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

const khataList = [
  {
    id: 1,
    no: '12',
    date: '03/02/2022',
    party: 'Demo',
    gross: 'Demo',
    discount: '5%',
    net: '2',
    CGST: '213434',
    SGST: '433433',
    final: '89898989',
    recived: '6465',

  }
];
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);


  khataColumns: string[] = [
    '#',
    'no',
    'date',
    'party',
    'gross',
    'discount',
    'net',
    'CGST',
    'SGST',
    'final',
    'recived',
    'action',
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
