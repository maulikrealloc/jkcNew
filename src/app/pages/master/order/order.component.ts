import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  orderColumns: string[] = [
    'srNo',
    'partyName',
    'orderDate',
    'deliveryDate',
    'designNo',
    'p-Order',
    'chalanNo',
    'status',
    'action',
  ];
  orderList: any = [];
  partyList: any = [];
  stausList: any =["Pending", "In Progress", "Rejected", "Cancelled", "Done"]

  dataSource = new MatTableDataSource(this.orderList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getOrderData();
    this.getPartyData();
  }

  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      this.partyList = party
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  getOrderData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      this.orderList = order
      if (order && order.length > 0) {
        this.dataSource = new MatTableDataSource(this.orderList);
      } else {
        this.orderList = [];
        this.dataSource = new MatTableDataSource(this.orderList);
      }
    }).catch((error) => {
      console.error('Error fetching order:', error);
    });
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'OrderList');
        this.getOrderData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'OrderList');
        this.getOrderData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'OrderList');
        this.getOrderData();
      }
    });
  }

  getPartyName(partyId: string): string {  
    return this.partyList.find((partyObj: any) => partyObj.id === partyId)?.firstName
  }

  changeStatus(status: string, element: any): any {
    element.orderStatus = status;
    this.firebaseCollectionService.updateDocument('CompanyList', element.id, element, 'OrderList');
    this.getOrderData();
  }

}
