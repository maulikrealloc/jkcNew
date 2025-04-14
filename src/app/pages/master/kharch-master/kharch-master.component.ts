import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { KharchDialogComponent } from './kharch-dialog/kharch-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-kharch-master',
  templateUrl: './kharch-master.component.html',
  styleUrls: ['./kharch-master.component.scss']
})

export class KharchMasterComponent implements OnInit {

  kharchMasterDataColumns: string[] = ['srNo', 'name', 'action'];
  UnitDataList: any = [];
  KharchDataList: any = [];
  unitDataSource = new MatTableDataSource(this.UnitDataList);
  kharchDataSource = new MatTableDataSource(this.KharchDataList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getunitList();
    this.getkharchList();
  }

  applyFilter(filterValue: string): void {
    this.unitDataSource.filter = filterValue.trim().toLowerCase();
    this.kharchDataSource.filter = filterValue.trim().toLowerCase();
  }

  addkharch(action: string, obj: any) {
    const dialogRef = this.dialog.open(KharchDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        if (result?.data?.unitKharch === 'unit') {
          this.commonService.commonApiCalled(result, obj, 'UnitDataList').then(() => this.getunitList()).catch(console.error);
        } if (result?.data?.unitKharch === 'kharch') {
          this.commonService.commonApiCalled(result, obj, 'KharchDataList').then(() => this.getkharchList()).catch(console.error);
        }
      }
    });
   
  }

  getunitList() {
    this.commonService.fetchData('UnitList', this.UnitDataList, this.unitDataSource);
  }

  getkharchList() {
    this.commonService.fetchData('kharchList', this.KharchDataList, this.kharchDataSource);
  }

}