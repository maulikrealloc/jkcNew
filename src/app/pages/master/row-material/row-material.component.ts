import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RowMaterialDialogComponent } from './row-material-dialog/row-material-dialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-row-material',
  templateUrl: './row-material.component.html',
  styleUrls: ['./row-material.component.scss']
})
  
export class RowMaterialComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  rowMaterialColumns: string[] = [
    '#',
    'name',
    'quantity',
    'price',
    'action'
  ]

  rowMaterialList: any = [];


  dataSource = new MatTableDataSource(this.rowMaterialList);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  
  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getRowMaterialData();
  }

  getRowMaterialData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'RowMaterialList').then((rowmaterial) => {
      this.rowMaterialList = rowmaterial
      if (rowmaterial && rowmaterial.length > 0) {
        this.dataSource = new MatTableDataSource(this.rowMaterialList);
      } else {
        this.rowMaterialList = [];
        this.dataSource = new MatTableDataSource(this.rowMaterialList);
      }
    }).catch((error) => {
      console.error('Error fetching rowmaterial:', error);
    });
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(RowMaterialDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'RowMaterialList');
        this.getRowMaterialData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'RowMaterialList');
        this.getRowMaterialData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'RowMaterialList');
        this.getRowMaterialData();
      }
    });
  }


}