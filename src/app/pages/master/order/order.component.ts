import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'partyName',
    'orderDate',
    'deliveryDate',
    'designNo',
    'p-Order',
    'chalanNo',
    'status',
    'action',
  ];
  employees: any = [
    {
      id: 1,
      party: 'abc',
      orderDate: "2024-04-16T18:30:00.000Z",
      deliveryDate: "2024-04-22T18:30:00.000Z",
      designNo: "ABC",
      partyOrder: "dff",
      chalanNo: "-",
      status: "",
      products: [
        {
          productName: "ffff",
          productQuantity: "99",
          productPrice: "5868"
        }
      ]
    }
  ]

  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.employees.push({
          id: this.employees.length + 1,
          party: result.data.party,
          designNo: result.data.designNo,
          partyOrder: result.data.partyOrder,
          chalanNo: result.data.chalanNo,
          orderDate: result.data.orderDate,
          deliveryDate: result.data.deliveryDate,
          products: result.data.products
        })
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result?.event === 'Edit') {
        this.employees.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.party = result.data.party,
              element.designNo = result.data.designNo,
              element.partyOrder = result.data.partyOrder,
              element.chalanNo = result.data.chalanNo,
              element.orderDate = result.data.orderDate,
              element.deliveryDate = result.data.deliveryDate,
              element.products = result.data.products
            element.id = result.data.id
          }
        });
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result?.event === 'Delete') {
        const allEmployeesData = this.employees
        this.employees = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.employees);
      }
    });
  }


}
