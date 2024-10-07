import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-chalan-list',
  templateUrl: './chalan-list.component.html',
  styleUrls: ['./chalan-list.component.scss']
})
export class ChalanListComponent implements OnInit {

  firmList: any = [];
  partyList: any = [];

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  chalanListColumns: string[] = [
    'srNo',
    'chalanNo',
    'chalanDate',
    'netAmount',
    'action',
  ];

  chalanList = [
    {
      id: 1,
      chalanNo: '12',
      chalanDate: '02/21/2023',
      netAmount: 2000,
    }
  ];

  chalanListdataSource = new MatTableDataSource(this.chalanList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getFirmData();
    this.getPartyData();
  }


  ngAfterViewInit(): void {
    this.chalanListdataSource.paginator = this.paginator;
  }

  getFirmData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'FirmList').then((firms) => {
      if (firms && firms.length > 0) {
        this.firmList = firms
      }
    }).catch((error) => {
      console.error('Error fetching firms:', error);
    });
  }

  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      if (party && party.length > 0) {
        this.partyList = party
      }
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }
}
