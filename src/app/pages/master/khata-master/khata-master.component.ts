import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { KhataMasterDialogComponent } from './khata-master-dialog/khata-master-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-khata-master',
  templateUrl: './khata-master.component.html',
  styleUrls: ['./khata-master.component.scss']
})

export class KhataMasterComponent implements OnInit {

  khataMasterDataColumns: string[] = ['srNo','companyName','ownerName','address','gstNo','panNo','mobileNo','action' ];
  khataList: any = [];
  khataListDataSource = new MatTableDataSource(this.khataList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.khataListDataSource.paginator = this.paginator;
    this.getKhataData();
  }

  applyFilter(filterValue: string): void {
    this.khataListDataSource.filter = filterValue.trim().toLowerCase();
  }

  getKhataData() {
    this.commonService.fetchData('KhataList', this.khataList, this.khataListDataSource);
  }

  addkhatu(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(KhataMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'KhataList').then(() => this.getKhataData()).catch(console.error);
      }
    });
  }

}