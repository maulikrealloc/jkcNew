import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddKharchDialogComponent } from './add-kharch-dialog/add-kharch-dialog.component';

@Component({
  selector: 'app-add-kharch',
  templateUrl: './add-kharch.component.html',
  styleUrls: ['./add-kharch.component.scss']
})
export class AddKharchComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);


  kharchColumns: string[] = [
    '#',
    'unitname',
    'kharchname',
    'dec',
    'date',
    'chalanno',
    'amount',
    'action',
  ];
  khataList: any = [
    {
      id: 1,
      unit: 'Demo',
      kharch: 'demo',
      dec: 'demo',
      date: '02/02/2022',
      chalanNo: '12',
      amount: '9999'
    }
  ];

  khataListdataSource = new MatTableDataSource(this.khataList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.khataListdataSource.paginator = this.paginator;

  }

  addkhatu(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AddKharchDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.khataList.push({
          id: this.khataList.length + 1,
          unit: result.data.unit,
          kharch: result.data.kharch,
          dec: result.data.dec,
          date: result.data.date,
          chalanNo: result.data.chalanNo,
          amount: result.data.amount
        })
        this.khataListdataSource = new MatTableDataSource(this.khataList);
      }
      if (result.event === 'Edit') {
        this.khataList.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.unit = result.data.unit
            element.kharch = result.data.kharch
            element.dec = result.data.dec
            element.date = result.data.date
            element.chalanNo = result.data.chalanNo
            element.amount = result.data.amount
            element.id = result.data.id
          }
        });
        this.khataListdataSource = new MatTableDataSource(this.khataList);
      }
      if (result.event === 'Delete') {
        const allkhataListData = this.khataList
        this.khataList = allkhataListData.filter((id: any) => id.id !== result.data.id)
        this.khataListdataSource = new MatTableDataSource(this.khataList);
      }
    });
  }

}