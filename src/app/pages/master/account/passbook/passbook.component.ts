import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-passbook',
  templateUrl: './passbook.component.html',
  styleUrls: ['./passbook.component.scss']
})
  
export class PassbookComponent implements OnInit {

  passbookDataColumns: string[] = ['passbook','name','date','debit','credit','balance' ];
  passbookList: any = []
  companyAccountList: any = [];
  incomeList: any = [];
  expensesmasterList: any = [];
  passbookListDataSource = new MatTableDataSource(this.passbookList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getPassBookData()
   }

  ngAfterViewInit() {
    this.passbookListDataSource.paginator = this.paginator;
  }

  getPassBookData() {
    forkJoin({ 
      PassBookList: this.commonService.fetchData('PassBookList', this.passbookList),
      CompanyAccountList: this.commonService.fetchData('CompanyAccountList', this.companyAccountList),
      IncomeList: this.commonService.fetchData('IncomeList', this.incomeList),
      ExpensesmasterList: this.commonService.fetchData('ExpensesmasterList', this.expensesmasterList)
    }).subscribe(response => { 
      this.passbookList = []

      this.companyAccountList
      this.incomeList
      this.expensesmasterList

      this.companyAccountList.forEach((element:any) => {
        const accountName = element.accountName;
        const date = element.date;
        const openingBalance = element.openingBalance;
        console.log(this.incomeList);
        
        const obj = {
          name: accountName,
          date: date,
          credit: openingBalance,
        }
        this.passbookList.push(obj)
      })
      this.passbookListDataSource = new MatTableDataSource(this.passbookList);
      this.passbookListDataSource.paginator = this.paginator;
    })
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }
   
  partyChange(event: any) {
    const partylist = this.passbookList.filter((partyObj: any) => partyObj.name === event.value)
    this.passbookListDataSource = new MatTableDataSource(partylist);
    this.passbookListDataSource.paginator = this.paginator;
  }
}