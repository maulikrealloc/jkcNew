import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddKharchDialogComponent } from './add-kharch-dialog/add-kharch-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-kharch',
  templateUrl: './add-kharch.component.html',
  styleUrls: ['./add-kharch.component.scss']
})

export class AddKharchComponent implements OnInit {

  @Output() kharchListUpdated = new EventEmitter<any[]>();

  dateKharchListForm: FormGroup;
  kharchDataColumns: string[] = [
    'srNo',
    'unitname',
    'kharchname',
    'dec',
    'date',
    'chalanno',
    'amount',
    'action',
  ];
  KharchList: any = [];
  kharchReportData: any = [];
  kharchListDataSource = new MatTableDataSource(this.KharchList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

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
    this.firebaseCollectionService.getDocuments('CompanyList', 'KharchList').then((kharch) => {
      this.KharchList = kharch
      if (kharch && kharch.length > 0) {
        this.kharchListUpdated.emit(kharch);
        this.kharchListDataSource = new MatTableDataSource(this.KharchList);
      } else {
        this.KharchList = [];
        this.kharchListDataSource = new MatTableDataSource(this.KharchList);
      }
    }).catch((error) => {
      console.error('Error fetching order:', error);
    });
  }

  openKhatu(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AddKharchDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'KharchList');
        this.getKharchData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'KharchList');
        this.getKharchData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'KharchList');
        this.getKharchData();
      }
    });
  }

}