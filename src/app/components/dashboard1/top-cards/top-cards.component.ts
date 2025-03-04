import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { NgFor } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { forkJoin } from 'rxjs';

interface topcards {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: number;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, NgFor],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent implements OnInit {

  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      img: '/assets/images/svgs/icon-user-male.svg',
      title: 'Total Firm',
      subtitle: 0,
    },
    {
      id: 2,
      color: 'warning',
      img: '/assets/images/svgs/icon-briefcase.svg',
      title: 'Total Party',
      subtitle: 0,
    },
    {
      id: 3,
      color: 'accent',
      img: '/assets/images/svgs/icon-mailbox.svg',
      title: 'Total Invoice',
      subtitle: 0,
    },
    {
      id: 4,
      color: 'error',
      img: '/assets/images/svgs/icon-favorites.svg',
      title: 'Pending Bills',
      subtitle: 0,
    },
    {
      id: 5,
      color: 'success',
      img: '/assets/images/svgs/icon-speech-bubble.svg',
      title: 'Ava. Balance',
      subtitle: 0,
    },
    {
      id: 6,
      color: 'accent',
      img: '/assets/images/svgs/icon-connect.svg',
      title: 'Reports',
      subtitle: 0,
    },
  ];

  firmList:any [] = []
  partyList:any [] = []
  InvoiceList:any [] = []

  dataSource!: MatTableDataSource<any>

  constructor(private commonService:CommonService) { }

  ngOnInit(): void {
    this.getDashboardData();
   }

  getDashboardData() {
    forkJoin({
      firms: this.commonService.fetchData('FirmList', this.firmList),
      parties: this.commonService.fetchData('PartyList', this.partyList),
      invoices: this.commonService.fetchData('InvoiceList', this.InvoiceList),
    }).subscribe(({ firms, parties, invoices }) => {
      debugger
      this.topcards[0].subtitle = this.firmList?.length;
      this.topcards[1].subtitle = this.partyList?.length;
      this.topcards[2].subtitle = this.InvoiceList?.length;
    });
  }

}
