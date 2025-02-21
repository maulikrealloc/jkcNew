import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { FilterService } from 'src/app/services/filter.service';

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

  constructor(private dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService,
    private filterService: FilterService) { }

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
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  getOrderData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      this.orderList = order
      if (order && order.length > 0) {
        this.orderDataSource = new MatTableDataSource(this.orderList);
        // this.filterService.filterTableData(this.orderDataSource, )
        this.orderDataSource.filterPredicate = (data: any, filter: string) => {
          return [
            this.getPartyName(data.partyId),
            this.convertTimestampToDate(data.orderDate),
            this.convertTimestampToDate(data.deliveryDate),
            data.designNo,
            data.partyOrder,
            data.products?.[0]?.productChalanNo || '',
            data.orderStatus
          ].join(' ').toLowerCase().includes(filter);
        }
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
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        const { event, data } = result;
        const { id } = obj;
        const collection = 'OrderList';

        event === 'Add' && this.firebaseCollectionService.addDocument('CompanyList', data, collection);
        event === 'Edit' && this.firebaseCollectionService.updateDocument('CompanyList', id, data, collection);
        event === 'Delete' && this.firebaseCollectionService.deleteDocument('CompanyList', id, collection);

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