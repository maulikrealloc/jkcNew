import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-income-data',
  templateUrl: './income-data.component.html',
  styleUrls: ['./income-data.component.scss']
})
export class IncomeDataComponent implements OnInit {
  totalAmount: number = 0;
  
  incomeDataColumns: string[] = [
    'partyName',
    'totalAmount'
  ];
  incomeMasterData: any = [];
  partyList: any = [];
  incomeListDataSource = new MatTableDataSource(this.incomeMasterData);

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getIncomeMasterList();
    this.getPartyData();
  }

  // getIncomeListData() {
  //   // this.commonService.fetchData('IncomeList', this.incomeDataList, this.incomeListDataSource).then((res) => {
  //   this.commonService.fetchData('IncomeMasterList', this.incomeMasterData, this.incomeListDataSource).then((res) => {
  //     const currentDate = new Date();
  //     const currentMonth = currentDate.getMonth();
  //     const currentYear = currentDate.getFullYear();

  //     const currentMonthExpenses = this.incomeMasterData.filter((expense: any) => {
  //       const expenseDate = new Date(expense.createddate.seconds * 1000);

  //       return (
  //         expenseDate.getMonth() === currentMonth &&
  //         expenseDate.getFullYear() === currentYear
  //       );
  //     });

  //     console.log("Current month incomeDataList:", currentMonthExpenses);
  //     this.incomeListDataSource = new MatTableDataSource(currentMonthExpenses)      
  //   });    
  // }
  getIncomeMasterList() {
    // this.commonService.fetchData('IncomeList', this.incomeDataList, this.incomeListDataSource).then((res) => {
    this.commonService.fetchData('IncomeMasterList', this.incomeMasterData, this.incomeListDataSource).then((res) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const currentMonthExpenses = this.incomeMasterData.filter((expense: any) => {
        const expenseDate = new Date(expense.createddate.seconds * 1000);

        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });

      console.log("Current month incomeDataList:", currentMonthExpenses);
      this.incomeListDataSource = new MatTableDataSource(currentMonthExpenses)      
    });    
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getPartyName(partyName: string) {
    return this.partyList.find((partyobj: any) => partyobj.id === partyName)?.firstName;
  }

  getTotalAmount(): number {
    return this.incomeMasterData.reduce((total: number, item: any) => total + (item.Amount || 0), 0);
  }

}
