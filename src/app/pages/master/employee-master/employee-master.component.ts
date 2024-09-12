import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})

export class EmployeeMasterComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
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

  employees: any = [
    {
      id: 1,
      firstName: 'Demo',
      lastName: 'Test',
      salary: 2000,
      mobileNo: 9876543210,
      bankName:'SBI',
      ifscCode:'vracha10e',
      bankAccountNo:'23332230'
    }
  ];

  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.employees.push({
          id: this.employees.length + 1,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          salary: result.data.salary,
          mobileNo: result.data.mobileNo,
          bankName: result.data.bankName,
          ifscCode: result.data.ifscCode,
          bankAccountNo: result.data.bankAccountNo,
        })
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result.event === 'Edit') {
        this.employees.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.firstName = result.data.firstName
            element.lastName = result.data.lastName
            element.salary = result.data.salary
            element.mobileNo = result.data.mobileNo
            element.bankName = result.data.bankName
            element.ifscCode = result.data.ifscCode
            element.bankAccountNo = result.data.bankAccountNo
          }
        });
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result.event === 'Delete') {
        const allEmployeesData = this.employees
        this.employees = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.employees);
      }
    });
  }
}