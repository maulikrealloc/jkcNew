import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-passbook',
  templateUrl: './passbook.component.html',
  styleUrls: ['./passbook.component.scss']
})
  
export class PassbookComponent implements OnInit {

  passbookDataColumns: string[] = ['#','passbook','name','date','debit','credit','balance' ];
  passbookList: any = []
  companyAccountList: any = [];
  passbookListDataSource = new MatTableDataSource(this.passbookList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getCompanyAccountData()
   }

  ngAfterViewInit() {
    this.passbookListDataSource.paginator = this.paginator;
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }
}