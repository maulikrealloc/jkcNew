import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})

export class EmployeeMasterComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  employeeMasterColumns: string[] = [
    '#',
    'firstName',
    'lastName',
    'salary',
    'phoneNo',
    'bankName',
    'ifscCode',
    'bankAccountNo',
    'action'
  ];

  employeesList: any = [];

  employeeListDataSource = new MatTableDataSource(this.employeesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }


  ngAfterViewInit(): void {
    this.employeeListDataSource.paginator = this.paginator;
    this.getEmployeeData();
  }

  getEmployeeData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'EmployeeList').then((employee) => {
      this.employeesList = employee
      if (employee && employee.length > 0) {
        this.employeeListDataSource = new MatTableDataSource(this.employeesList);
      } else {
        this.employeesList = [];
        this.employeeListDataSource = new MatTableDataSource(this.employeesList);
      }
    }).catch((error) => {
      console.error('Error fetching employee:', error);
    });
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'EmployeeList');
        this.getEmployeeData();
      }
      if (result.event === 'Edit') {
        this.employeesList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'EmployeeList');
            this.getEmployeeData();
          }
        });
      }
      if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'EmployeeList');
        this.getEmployeeData();
      }
    });
  }
}