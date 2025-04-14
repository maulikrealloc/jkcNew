import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OrderListDialogComponent } from './order-list-dialog/order-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})

export class OrderListComponent implements OnInit {

  dateOrderListForm: FormGroup;
  orderDataColumns: string[] = [
    'srNo',
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
  khataOrderList: any = [];
  khataList: any = [];
  partyList: any = [];
  orderList: any = [];
  isChecked: boolean = false;
  orderDataSource = new MatTableDataSource(this.khataOrderList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private commonService: CommonService, private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.orderDataSource.paginator = this.paginator;
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateOrderListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });
    this.getKhataOrderData();
    this.getKhataData();
    this.getPartyData();
    this.getOrderData();
  }

  filterDate() {
    if (!this.khataOrderList) return;
    const startDate = this.dateOrderListForm.value.start ? new Date(this.dateOrderListForm.value.start) : null;
    const endDate = this.dateOrderListForm.value.end ? new Date(this.dateOrderListForm.value.end) : null;
    if (startDate && endDate) {
      this.orderDataSource.data = this.khataOrderList.filter((invoice: any) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date.seconds * 1000);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else {
      this.orderDataSource.data = this.khataOrderList;
    }
  }

  getKhataOrderData() {
    this.commonService.fetchData('KhataOrderList', this.khataOrderList, this.orderDataSource).then(res => {
      this.filterOrders()
    });
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getPartyName(party: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === party)?.firstName
  }

  getKhataData() {
    this.commonService.fetchData('KhataList', this.khataList);
  }

  getKhataName(khata: string): string {
    return this.khataList.find((khataObj: any) => khataObj.id === khata)?.companyName
  }

  getOrderData() {
    this.commonService.fetchData('OrderList', this.orderList);
  }

  getOrderNo(order: string): string {
    return this.orderList.find((orderObj: any) => orderObj.id === order)?.partyOrder
  }

  partyChange(event: any) {
    const partyChange = this.khataOrderList.filter((khataOrderObj: any) => khataOrderObj.khata === event.value)
    this.orderDataSource = new MatTableDataSource(partyChange);
  }

  transferOrder(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OrderListDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'KhataOrderList').then(() => this.getKhataOrderData()).catch(console.error);
      }
    });
  }

  filterOrders() {
    if (this.isChecked) {
      this.orderDataSource.data = this.khataOrderList.filter((order: any) => order.status === 'Done');
    } else {
      this.orderDataSource.data = this.khataOrderList.filter((order: any) => order.status === 'Pending');
    }
  }

  markAsDone(element: any) {
    const updateData = { status: 'Done' };
    this.firebaseCollectionService.updateDocument('CompanyList', element.id, updateData, 'KhataOrderList')
    .then(() => {
      element.status = 'Done';
      this.filterOrders();
      })
      .catch(error => {
        console.error('Update failed:', error);
        element.status = 'Pending';
      });
  }

}