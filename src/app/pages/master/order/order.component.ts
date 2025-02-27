import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
  
export class OrderComponent implements OnInit {

  orderDataColumns: string[] = [ 'orderNo', 'partyName', 'orderDate', 'deliveryDate', 'designNo', 'p-Order', 'chalanNo', 'status', 'action'];
  orderList: any = [];
  partyList: any = [];
  stausList: any = ["Pending", "In Progress", "Rejected", "Cancelled", "Done"];
  orderDataSource = new MatTableDataSource(this.orderList);

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService,
    private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getOrderData();
    this.getPartyData();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  ngAfterViewInit() {
    this.orderDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.orderDataSource.filter = filterValue.trim().toLowerCase();
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getOrderData() {
    this.commonService.fetchData('OrderList', this.orderList, this.orderDataSource).then(data => {
      if (this.orderList.length > 0) { this.filterData();  } 
    });
  }

  filterData() {
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
  }

  addDesign(action: string, obj: any) {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'OrderList').then(() => this.getOrderData()).catch(console.error);
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

  orderStatus(status:any) {
    return {
      'pending-status': status === 'Pending',
      'in-progress-status': status === 'In Progress',
      'rejected-status': status === 'Rejected',
      'cancelled-status': status === 'Cancelled',
      'done-status': status === 'Done'
    }
  }
}