import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})

export class EmployeeMasterComponent implements OnInit {

  employeeMasterDataColumns: string[] = ['#','firstName','lastName','salary','phoneNo','bankName','ifscCode','bankAccountNo','action' ];
  employeesList: any = [];
  employeeListDataSource = new MatTableDataSource(this.employeesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService) { }

  ngOnInit() {
    this.employeeListDataSource.paginator = this.paginator;
    this.getEmployeeData();
  }

  applyFilter(filterValue: string): void {
    this.employeeListDataSource.filter = filterValue.trim().toLowerCase();
  }

  getEmployeeData() {
    this.commonService.fetchData('EmployeeList', this.employeesList, this.employeeListDataSource);
  }

  openEmployee(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'EmployeeList').then(() => this.getEmployeeData()).catch(console.error);
      }
    });
  }

}