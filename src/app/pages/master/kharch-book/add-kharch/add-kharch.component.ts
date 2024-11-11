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
    'srNo',
    'unitname',
    'kharchname',
    'dec',
    'date',
    'chalanno',
    'amount',
    'action',
  ];
  kharchList: any = [
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

  kharchListdataSource = new MatTableDataSource(this.kharchList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.kharchListdataSource.paginator = this.paginator;
  }

  addkhatu(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AddKharchDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.kharchList.push({
          id: this.kharchList.length + 1,
          unit: result.data.unit,
          kharch: result.data.kharch,
          dec: result.data.dec,
          date: result.data.date,
          chalanNo: result.data.chalanNo,
          amount: result.data.amount
        })
        this.kharchListdataSource = new MatTableDataSource(this.kharchList);
      }
      if (result.event === 'Edit') {
        this.kharchList.forEach((element: any) => {
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
        this.kharchListdataSource = new MatTableDataSource(this.kharchList);
      }
      if (result.event === 'Delete') {
        const allkhataListData = this.kharchList
        this.kharchList = allkhataListData.filter((id: any) => id.id !== result.data.id)
        this.kharchListdataSource = new MatTableDataSource(this.kharchList);
      }
    });
  }

}