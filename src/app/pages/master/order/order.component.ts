import { Component, OnInit, ViewChild } from '@angular/core';
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
  
export class OrderComponent implements OnInit {

  orderDataColumns: string[] = [
    'orderNo',
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
  stausList: any = ["Pending", "In Progress", "Rejected", "Cancelled", "Done"];
  orderDataSource = new MatTableDataSource(this.orderList);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.orderDataSource.paginator = this.paginator;
    this.getOrderData();
    this.getPartyData();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  applyFilter(filterValue: string): void {
    this.orderDataSource.filter = filterValue.trim().toLowerCase();
  }

  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      this.partyList = party
      console.log(this.partyList,'partylist========');
      
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  getOrderData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      this.orderList = order
      if (order && order.length > 0) {
        this.orderDataSource = new MatTableDataSource(this.orderList);

        this.orderDataSource.filterPredicate = (data: any, filter) => {
          const partyName = this.getPartyName(data.partyId);
          const orderDate = this.convertTimestampToDate(data.orderDate);
          const deliveryDate = this.convertTimestampToDate(data.deliveryDate);
          const chalanNo = data.products?.[0]?.productChalanNo || '';
          const dataStr = `
        ${partyName}
        ${orderDate}
        ${deliveryDate}
        ${data.designNo}
        ${data.partyOrder}
        ${chalanNo}
        ${data.orderStatus}
      `.toLowerCase();
          return dataStr.includes(filter);
        };
      } else {
        this.orderList = [];
        this.orderDataSource = new MatTableDataSource(this.orderList);
      }
      this.orderDataSource.paginator = this.paginator;
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