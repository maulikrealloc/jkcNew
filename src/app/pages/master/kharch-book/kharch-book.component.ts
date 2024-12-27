import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kharch-book',
  templateUrl: './kharch-book.component.html',
  styleUrls: ['./kharch-book.component.scss']
})
export class KharchBookComponent implements OnInit {

  kharchReportData: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  updateKharchList(updatedList: any[]) {
    this.kharchReportData = updatedList;
  }

}