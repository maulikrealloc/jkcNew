import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OrderListDialogComponent } from './order-list-dialog/order-list-dialog.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  orderColumns: string[] = [
    '#',
    'partyName',
    'khataName',
    'partyOrder',
    'itemName',
    'price',
    'quantity',
    'total',
    'status',
    'action'
  ];
  order: any = [
    {
      id: 1,
      partyName: 'Demo',
      khataName: 'Test',
      partyOrder: 'adcc',
      itemName: 'adcc',
      price: 'adcc',
      quantity: 'adcc',
      total: 'adcc',
      status: 'adcc',
    }
  ];

  orderDataSource = new MatTableDataSource(this.order);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.orderDataSource.paginator = this.paginator;
  }

  transferOrder(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OrderListDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.order.push({
          id: result.data.legth + 1,
          party: result.data.party,
          order: result.data.order,
          khata: result.data.khata,
          date: result.data.date
        })
        this.orderDataSource = new MatTableDataSource(this.order);
      }
      if (result?.event === 'Edit') {
        this.order.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.party = result.data.party
            element.order = result.data.order
            element.khata = result.data.khata
            element.date = result.data.date
            element.id = result.data.id
          }
        });
        this.orderDataSource = new MatTableDataSource(this.order);
      }
      if (result?.event === 'Delete') {
        const allOrderData = this.order
        this.order = allOrderData.filter((id: any) => id.id !== result.data.id)
        this.orderDataSource = new MatTableDataSource(this.order);
      }
    });
  }
}
