import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-income-data',
  templateUrl: './income-data.component.html',
  styleUrls: ['./income-data.component.scss']
})
export class IncomeDataComponent implements OnInit {

  incomeDataColumns: string[] = [
    'partyName',
    'totalAmount'
  ];
  incomeDataList: any = [];
  incomeListDataSource = new MatTableDataSource(this.incomeDataList);

  constructor(private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getIncomeListData();
  }

  getIncomeListData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'IncomeList').then((income) => {
      this.incomeDataList = income
      if (income && income.length > 0) {
        this.incomeListDataSource = new MatTableDataSource(this.incomeDataList);
      }
    }).catch((error) => {
      console.error('Error fetching income:', error);
    });
  }

  getTotalAmount(): number {
    return this.incomeDataList.reduce((total: number, item: any) => total + (item.amount || 0), 0);
  }

}
