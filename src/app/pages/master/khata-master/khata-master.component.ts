import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { KhataMasterDialogComponent } from './khata-master-dialog/khata-master-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-khata-master',
  templateUrl: './khata-master.component.html',
  styleUrls: ['./khata-master.component.scss']
})

export class KhataMasterComponent implements OnInit {

  khataMasterDataColumns: string[] = [
    'srNo',
    'companyName',
    'ownerName',
    'address',
    'gstNo',
    'panNo',
    'mobileNo',
    'action',
  ];
  khataList: any = [];
  khataListDataSource = new MatTableDataSource(this.khataList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.khataListDataSource.paginator = this.paginator;
    this.getKhataData();
  }

  getKhataData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'KhataList').then((khata) => {
      this.khataList = khata
      if (khata && khata.length > 0) {
        this.khataListDataSource = new MatTableDataSource(this.khataList);
      } else {
        this.khataList = [];
        this.khataListDataSource = new MatTableDataSource(this.khataList);
      }
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  addkhatu(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(KhataMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'KhataList');
        this.getKhataData();
      }
      if (result?.event === 'Edit') {
        this.khataList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'KhataList');
            this.getKhataData();
          }
        });
        this.khataListDataSource = new MatTableDataSource(this.khataList);
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'KhataList');
        this.getKhataData();
      }
    });
  }

}