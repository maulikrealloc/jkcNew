import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { KhataMasterDialogComponent } from './khata-master-dialog/khata-master-dialog.component';

@Component({
  selector: 'app-khata-master',
  templateUrl: './khata-master.component.html',
  styleUrls: ['./khata-master.component.scss']
})
export class KhataMasterComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);


  khataColumns: string[] = [
    '#',
    'name',
    'ownerName',
    'address',
    'gstNo',
    'panNo',
    'mobileNo',
    'action',
  ];

  khataList: any = [
    {
      id: 1,
      name: 'Demo',
      ownerName: 'Test',
      address: 2000,
      gst: 9876543210,
      pan: 9876543210,
      mobileNo: 9876543210
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
    const dialogRef = this.dialog.open(KhataMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.khataList.push({
          id: result.data.legth + 1,
          name: result.data.name,
          ownerName: result.data.ownerName,
          address: result.data.address,
          gst: result.data.gst,
          pan: result.data.pan,
          mobileNo: result.data.mobileNo
        })
        this.khataListdataSource = new MatTableDataSource(this.khataList);
      }
      if (result?.event === 'Edit') {
        this.khataList.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.name = result.data.name
            element.ownerName = result.data.ownerName
            element.address = result.data.address
            element.gst = result.data.gst
            element.pan = result.data.pan
            element.mobileNo = result.data.mobileNo
          }
        });
        this.khataListdataSource = new MatTableDataSource(this.khataList);
      }
      if (result?.event === 'Delete') {
        const allKhataListData = this.khataList
        this.khataList = allKhataListData.filter((id: any) => id.id !== result.data.id)
        this.khataListdataSource = new MatTableDataSource(this.khataList);
      }
    });
  }
}
