import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-kharch-book',
  templateUrl: './kharch-book.component.html',
  styleUrls: ['./kharch-book.component.scss']
})
export class KharchBookComponent implements OnInit {
  activeTab = 0;
  expensesList:any =[ ]
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.fetchDataBasedOnTab();
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.activeTab = event.index;
    this.fetchDataBasedOnTab();
  }

  fetchDataBasedOnTab() {
    switch (this.activeTab) {
      case 1:
        this.commonService.fetchData('ExpensesList', this.expensesList).then((data: any) => {

        });
        break;
    }
  }
}