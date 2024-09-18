import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RowMaterialDialogComponent } from './row-material-dialog/row-material-dialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-row-material',
  templateUrl: './row-material.component.html',
  styleUrls: ['./row-material.component.scss']
})
export class RowMaterialComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  displayedColumns: string[] = [
    '#',
    'name',
    'quantity',
    'price',
    'action'
  ]

  namelist: any = []


  dataSource = new MatTableDataSource(this.namelist);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addRowMaterial(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(RowMaterialDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) =>{
      if (result?.event === 'Add') {
        this.namelist.push({
          id: this.namelist.length + 1,
          name: result.data.name,
          quantity: result.data.quantity,
          price: result.data.price
        })
        this.dataSource = new MatTableDataSource(this.namelist);
        console.log('this.namelist======>>>>>>',this.namelist);
      }
      if(result?.event === 'Edit'){
        this.namelist.forEach((element:any) =>{
          if(element.id === result.data.id){
            element.id = result.data.id
            element.name = result.data.name
            element.quantity = result.data.quantity
            element.price = result.data.price
          }
        })
        this.dataSource = new MatTableDataSource(this.namelist);
      }
      if(result?.event === 'Delete'){
        const allrowmaterial = this.namelist;
        this.namelist = allrowmaterial.filter((id:any) =>id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.namelist)
      }
    })
  }
}
