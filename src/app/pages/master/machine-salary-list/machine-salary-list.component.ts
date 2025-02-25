import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MachineSalaryDialogComponent } from './machine-salary-dialog/machine-salary-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-machine-salary-list',
  templateUrl: './machine-salary-list.component.html',
  styleUrls: ['./machine-salary-list.component.scss']
})

export class MachineSalaryListComponent implements OnInit {

  machineSalaryDataColumns: string[] = [
    '#',
    'employee',
    'amount',
    'date',
    'action',
  ];
  dateMachineSalaryForm: FormGroup;
  machineSalaryList: any = [];
  employeesList: any = [];
  machineSalaryDataSource = new MatTableDataSource(this.machineSalaryList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateMachineSalaryForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.getmachineSalaryData();
    this.getEmployeeData();
    this.machineSalaryDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.machineSalaryDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getmachineSalaryData() {
    this.commonService.fetchData('MachineSalaryList', this.machineSalaryList, this.machineSalaryDataSource);
  }

  getEmployeeData() {
    this.commonService.fetchData('EmployeeList', this.employeesList);
  }

  getEmployeeName(employeeId: string): string {
    return this.employeesList.find((employeeObj: any) => employeeObj.id === employeeId)?.firstName
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(MachineSalaryDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'MachineSalaryList').then(() => this.getmachineSalaryData()).catch(console.error);
      }
    });
  }

}