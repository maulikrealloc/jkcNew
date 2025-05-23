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
  expensesList: any = [];
  partyList: any = [];
  remainingBalance: number = 0;
  passbookListDataSource = new MatTableDataSource(this.passbookList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getPassBookData();
    this.getPartyData();
   }

  ngAfterViewInit() {
    this.passbookListDataSource.paginator = this.paginator;
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }
   
  partyChange(event: any) {
    let balance = 0;
    const partylist = this.passbookList.filter((partyObj: any) => partyObj.accountName === event.value || partyObj.account === event.value || partyObj.paidBy === event.value )
    const updatedPartyList = partylist.map((transaction: any) => {
      if (transaction.credit) {
        balance += transaction.credit;
      } else if (transaction.debit) {
        balance -= transaction.debit;
      }
      return { ...transaction, balance };
    });
    this.remainingBalance = balance
    this.passbookListDataSource = new MatTableDataSource(updatedPartyList);
    this.passbookListDataSource.paginator = this.paginator;
  }

  getPassBookData() {
    this.getPartyData();

    forkJoin({
      PassBookList: this.commonService.fetchData('PassBookList', this.passbookList),
      CompanyAccountList: this.commonService.fetchData('CompanyAccountList', this.companyAccountList),
      IncomeList: this.commonService.fetchData('IncomeList', this.incomeList),
      ExpensesmasterList: this.commonService.fetchData('ExpensesList', this.expensesList)
    }).subscribe((response: any) => {
      this.passbookList = [];
      let balance = 0;
      this.companyAccountList?.forEach((element: any) => {
        balance += element.openingBalance || 0
        this.passbookList.push({
          name: 'Opening Balance', 
          accountName: element.accountName,
          date: element.date,
          credit: element.openingBalance,
          debit: 0,
          balance: balance
        });
      });

      this.incomeList?.forEach((element: any) => {
        balance += element.amount || 0; 
        this.passbookList.push({
          name: this.getPartyName(element.partyName), 
          account: element.account,
          date: element.invoiceDate,
          credit: element.amount || 0,
          debit: 0,
          balance: balance
        });
      });

      this.expensesList?.forEach((element: any) => {
        balance -= element.amount || 0;
        this.passbookList.push({
          paidBy: element.paidBy,
          name: element.expensesType,
          date: element.date,
          credit: 0,
          debit: element.amount || 0,
          balance: balance
        });
      });

      const passBookData = response.PassBookList || [];
      this.passbookList = [...this.passbookList, ...passBookData];
      
      if (this.passbookList.length > 0) {
        const defaultParty =
          this.passbookList[0].accountName ||
          this.passbookList[0].account ||
          this.passbookList[0].paidBy;

        this.partyChange({ value: defaultParty });
      }

      this.passbookListDataSource = new MatTableDataSource(this.passbookList);
      this.passbookListDataSource.paginator = this.paginator;
    });
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getPartyName(partyName: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyName)?.firstName
  }

}