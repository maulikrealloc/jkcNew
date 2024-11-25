import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddKharchDialogComponent } from './add-kharch-dialog/add-kharch-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-add-kharch',
  templateUrl: './add-kharch.component.html',
  styleUrls: ['./add-kharch.component.scss']
})
export class AddKharchComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);


  kharchColumns: string[] = [
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

  kharchListdataSource = new MatTableDataSource(this.KharchList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }
  
  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  ngOnInit(): void {
    this.getKharchData();
  }

  ngAfterViewInit(): void {
    this.kharchListdataSource.paginator = this.paginator;
  }
  
  getKharchData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'KharchList').then((kharch) => {
      this.KharchList = kharch
      if (kharch && kharch.length > 0) {
        this.kharchListdataSource = new MatTableDataSource(this.KharchList);
      } else {
        this.KharchList = [];
        this.kharchListdataSource = new MatTableDataSource(this.KharchList);
      }
    }).catch((error) => {
      console.error('Error fetching order:', error);
    });
  }

  addkhatu(action: string, obj: any) {
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