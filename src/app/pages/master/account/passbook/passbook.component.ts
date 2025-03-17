import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
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
    this.getPassBookData()
   }

  ngAfterViewInit() {
    this.passbookListDataSource.paginator = this.paginator;
  }

  getPassBookData() {
    this.commonService.fetchData('PassBookList', this.passbookList,this.passbookListDataSource);
    console.log('[{this.passbookList}]', this.passbookList);
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList',this.companyAccountList).then((data: any) => {
      this.passbookList = this.companyAccountList
    })
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }
  
  paidbyChange(event: any) {
    const paidbylist = this.passbookList.filter((paidbyObj: any) => paidbyObj.accountName === event.value)
    this.passbookListDataSource = new MatTableDataSource(paidbylist);
    this.passbookListDataSource.paginator = this.paginator;
  }

}