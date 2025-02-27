import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RowMaterialDialogComponent } from './row-material-dialog/row-material-dialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-row-material',
  templateUrl: './row-material.component.html',
  styleUrls: ['./row-material.component.scss']
})

export class RowMaterialComponent implements OnInit {

  rowMaterialDataColumns: string[] = ['#','name','quantity','price','action']
  rowMaterialList: any = [];
  rowDataSource = new MatTableDataSource(this.rowMaterialList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getRowMaterialData();
  }

  ngAfterViewInit() {
    this.rowDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.rowDataSource.filter = filterValue.trim().toLowerCase();
  }

  getRowMaterialData() {
    this.commonService.fetchData('RowMaterialList', this.rowMaterialList, this.rowDataSource);
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(RowMaterialDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'RowMaterialList').then(() => this.getRowMaterialData()).catch(console.error);
      }
    });
  }

}