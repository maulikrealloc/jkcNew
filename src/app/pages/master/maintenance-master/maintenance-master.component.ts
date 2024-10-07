import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MaintenanceMasterDialogComponent } from './maintenance-master-dialog/maintenance-master-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-maintenance-master',
  templateUrl: './maintenance-master.component.html',
  styleUrls: ['./maintenance-master.component.scss']
})
export class MaintenanceMasterComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  maintenanceMasterColumns: string[] = [
    '#',
    'name',
    'value',
    'action',
  ];

  maintenanceMasterList: any = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  dataSource = new MatTableDataSource(this.maintenanceMasterList);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getMaintenanceData();
  }

  getMaintenanceData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'MaintenanceList').then((maintenance) => {
      this.maintenanceMasterList = maintenance
      if (maintenance && maintenance.length > 0) {
        this.dataSource = new MatTableDataSource(this.maintenanceMasterList);
      } else {
        this.maintenanceMasterList = [];
        this.dataSource = new MatTableDataSource(this.maintenanceMasterList);
      }
    }).catch((error) => {
      console.error('Error fetching maintenance:', error);
    });
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
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'MaintenanceList');
        this.getMaintenanceData();
      }
      if (result?.event === 'Edit') {
        this.maintenanceMasterList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'MaintenanceList');
            this.getMaintenanceData();
          }
        });
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'MaintenanceList');
        this.getMaintenanceData();
      }
    });
  }
}

