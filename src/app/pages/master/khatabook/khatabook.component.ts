import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-khatabook',
  templateUrl: './khatabook.component.html',
  styleUrls: ['./khatabook.component.scss']
})
export class KhatabookComponent implements OnInit {
  khataOrderList: any = [];
  activeTab = 0;
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
        this.commonService.fetchData('KhataOrderList', this.khataOrderList).then((data: any) => {
            
        });
        break;
    }
  }
  
  }