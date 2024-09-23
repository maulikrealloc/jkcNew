import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MaintenanceMasterDialogComponent } from './maintenance-master-dialog/maintenance-master-dialog.component';

@Component({
  selector: 'app-maintenance-master',
  templateUrl: './maintenance-master.component.html',
  styleUrls: ['./maintenance-master.component.scss']
})
export class MaintenanceMasterComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'name',
    'value',
    'action',
  ];
  
  maintenanceMaster: any = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  dataSource = new MatTableDataSource(this.maintenanceMaster);

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getTotal(): number {
    return this.maintenanceMaster.reduce((acc: number, curr: { value: number; }) => acc + curr.value, 0);
  }

  addMaintenance(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(MaintenanceMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.maintenanceMaster.push({
          id: this.maintenanceMaster.length + 1,
          name: result.data.name,
          value: result.data.value,
        })
        this.dataSource = new MatTableDataSource(this.maintenanceMaster);        
      }
      if (result?.event === 'Edit') {
        this.maintenanceMaster.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.name = result.data.name
            element.value = result.data.value
            element.id = result.data.id
          }
        });
        this.dataSource = new MatTableDataSource(this.maintenanceMaster);
      }
      if (result?.event === 'Delete') {
        const allEmployeesData = this.maintenanceMaster
        this.maintenanceMaster = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.maintenanceMaster);
      }
    });
  } 
}

