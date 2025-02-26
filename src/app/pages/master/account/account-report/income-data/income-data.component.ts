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
  incomeDataList: any = [];
  incomeListDataSource = new MatTableDataSource(this.incomeDataList);

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getIncomeListData();
  }

  getIncomeListData() {
    this.commonService.fetchData('IncomeList', this.incomeDataList, this.incomeListDataSource)
  }

  getTotalAmount(): number {
    return this.incomeDataList.reduce((total: number, item: any) => total + (item.amount || 0), 0);
  }

}
