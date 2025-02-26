import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddKharchDialogComponent } from './add-kharch-dialog/add-kharch-dialog.component';
import { Timestamp } from 'firebase/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-kharch',
  templateUrl: './add-kharch.component.html',
  styleUrls: ['./add-kharch.component.scss']
})

export class AddKharchComponent implements OnInit {

  @Output() kharchListUpdated = new EventEmitter<any[]>();

  dateKharchListForm: FormGroup;
  kharchDataColumns: string[] = ['srNo','unitname','kharchname','dec','date','chalanno','amount','action' ];
  KharchList: any = [];
  kharchReportData: any = [];
  kharchListDataSource = new MatTableDataSource(this.KharchList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService: CommonService, private dialog: MatDialog) { }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateKharchListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.getKharchData();
    this.kharchListDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.kharchListDataSource.filter = filterValue.trim().toLowerCase();
  }

  getKharchData() {
    this.commonService.fetchData('KharchList', this.KharchList, this.kharchListDataSource);
  }

  openKhatu(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AddKharchDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'KharchList').then(() => this.getKharchData()).catch(console.error);
      }
    });
  }

}