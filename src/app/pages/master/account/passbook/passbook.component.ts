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

  passbookDataColumns: string[] = ['passbook', 'name', 'date', 'debit', 'credit', 'balance'];
  passbookList: any = []
  companyAccountList: any = [];
  incomeList: any = [];
  expensesList: any = [];
  partyList: any = [];
  remainingBalance: number = 0;
  selectedParty: any;
  transferList: any = [];

  passbookListDataSource = new MatTableDataSource(this.passbookList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  updatedPartyList: any =[];

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getPassBookData();
    this.getPartyData();
    this.getTransferData();
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
    this.selectedParty = event.value
    let balance = 0;
    
    const partylist = this.passbookList.filter((partyObj: any) => partyObj.accountName ===  this.selectedParty || partyObj.account ===  this.selectedParty || partyObj.paidBy ===  this.selectedParty)
    this.updatedPartyList = partylist.map((transaction: any) => {
      if (transaction.credit) {
        balance += transaction.credit;
      } else if (transaction.debit) {
        balance -= transaction.debit;
      }
      return { ...transaction, balance };
    });
    this.remainingBalance = balance
    this.passbookListDataSource = new MatTableDataSource(this.updatedPartyList);
    this.passbookListDataSource.paginator = this.paginator;
  }

  getPassBookData() {
    this.getPartyData();

    forkJoin({
      PassBookList: this.commonService.fetchData('PassBookList', this.passbookList),
      CompanyAccountList: this.commonService.fetchData('CompanyAccountList', this.companyAccountList),
      IncomeList: this.commonService.fetchData('IncomeList', this.incomeList),
      ExpensesmasterList: this.commonService.fetchData('ExpensesList', this.expensesList),
      TransferList: this.commonService.fetchData('TransferList', this.transferList)
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

      this.transferList?.forEach((element: any) => {
        balance -= element.amount || 0;
        // this.passbookList.push({
        //   paidBy: element.from, 
        //   name: element.to,  
        //   date: element.date,  
        //   credit: 0,
        //   debit: element.amount || 0,
        //   balance: balance
        // });
        this.passbookList.push({
          paidBy: element.from,  
          name: element.to,  
          date: element.date || new Date(),
          credit: 0,
          debit: element.amount || 0,
          balance: balance
        });

        balance += element.amount || 0;  
        this.passbookList.push({
          paidBy: element.to,  
          name: element.from,  
          date: element.date || new Date(),
          credit: element.amount || 0,
          debit: 0,
          balance: balance
        });
      });

      const passBookData = response.PassBookList || [];
      this.passbookList = [...this.passbookList, ...passBookData];
      
      if (this.passbookList.length > 0) {
        this.partyChange({ value: this.companyAccountList[0]?.accountName })
      }
    });
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getTransferData() {
    this.commonService.fetchData('TransferList', this.transferList).then((res) => {

    });
  }


  getPartyName(partyName: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyName)?.firstName
  }

}