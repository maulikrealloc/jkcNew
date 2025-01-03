import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-passbook',
  templateUrl: './passbook.component.html',
  styleUrls: ['./passbook.component.scss']
})
export class PassbookComponent implements OnInit {

  passbookDataColumns: string[] = [
    '#',
    'passbook',
    'name',
    'date',
    'debit',
    'credit',
    'balance'
  ];
  passbookList: any = []
  passbookListDataSource = new MatTableDataSource(this.passbookList);

  constructor() { }

  ngOnInit(): void { }

}
