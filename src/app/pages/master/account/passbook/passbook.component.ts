import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-passbook',
  templateUrl: './passbook.component.html',
  styleUrls: ['./passbook.component.scss']
})
export class PassbookComponent implements OnInit {

  passbookColumns: string[] = [
    '#',
    'passbook',
    'name',
    'date',
    'debit',
    'credit',
    'balance'
  ];

  Passbook: any = []
  
  dataSource = new MatTableDataSource(this.Passbook);
  constructor() { }

  ngOnInit(): void { }

}
