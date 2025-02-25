import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MaintenanceMasterDialogComponent } from './maintenance-master-dialog/maintenance-master-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-maintenance-master',
  templateUrl: './maintenance-master.component.html',
  styleUrls: ['./maintenance-master.component.scss']
})
  
export class MaintenanceMasterComponent implements OnInit {

  maintenanceMasterDataColumns: string[] = [
    '#',
    'name',
    'value',
    'action',
  ];
  maintenanceMasterList: any = [];
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  maintenanceMasterDataSource = new MatTableDataSource(this.maintenanceMasterList);

  constructor(private dialog: MatDialog, private commonService: CommonService, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.maintenanceMasterDataSource.paginator = this.paginator;
    this.getMaintenanceData();
  }

  applyFilter(filterValue: string): void {
    this.maintenanceMasterDataSource.filter = filterValue.trim().toLowerCase();
  }

  getMaintenanceData() {
    this.commonService.fetchData('MaintenanceList', this.maintenanceMasterList, this.maintenanceMasterDataSource);
  }

  getTotal(): number {
    return this.maintenanceMasterList.reduce((acc: number, curr: { value: number; }) => acc + curr.value, 0);
  }

  addMaintenance(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(MaintenanceMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'MaintenanceList').then(() => this.getMaintenanceData()).catch(console.error);
      }
    });
  }

}