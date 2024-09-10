import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-passbook',
  templateUrl: './passbook.component.html',
  styleUrls: ['./passbook.component.scss']
})
export class PassbookComponent implements OnInit {

  displayedColumns: string[] = [
    '#',
    'passbook',
    'name',
    'date',
    'debit',
    'credit',
    'balance'
  ];
  Passbook: any = [
    {
      id:1,
      passbook:1,
      name:'Opening Balance',
      date:'01/24/2023',
      debit: '- ',
      credit: 1000,
      balance:1000
    }
  ]
  dataSource = new MatTableDataSource(this.Passbook);
  constructor() { }

  ngOnInit(): void { }

}
