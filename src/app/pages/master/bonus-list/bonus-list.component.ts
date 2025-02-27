import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BonusListDialogComponent } from './bonus-list-dialog/bonus-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-bonus-list',
  templateUrl: './bonus-list.component.html',
  styleUrls: ['./bonus-list.component.scss']
})

export class BonusListComponent implements OnInit {

  dateBonusForm: FormGroup;
  bounsDataColumns: string[] = ['#','employee','amount','date','action' ];
  bonusList: any = [];
  employeesList: any = [];
  bonusListDataSource = new MatTableDataSource(this.bonusList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(
    private fb: FormBuilder, private commonService: CommonService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateBonusForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.getBonusData();
    this.getEmployeeData();
    this.bonusListDataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.bonusListDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.bonusListDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getBonusData() {
    this.commonService.fetchData('BonusList', this.bonusList, this.bonusListDataSource);
  }

  getEmployeeData() {
    this.commonService.fetchData('EmployeeList', this.employeesList);
  }

  getEmployeeName(employeeId: string): string {
    return this.employeesList.find((employeeObj: any) => employeeObj.id === employeeId)?.firstName
  }

  openBonus(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(BonusListDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'BonusList').then(() => this.getBonusData()).catch(console.error);
      }
    });
  }

}