import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OrderListDialogComponent } from './order-list-dialog/order-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  isChecked: boolean = false;
  orderDataSource = new MatTableDataSource(this.khataOrderList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder, private firebaseCollectionService: FirebaseCollectionService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateOrderListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });
    this.getKhataOrderData();
    this.getKhataData();
    this.orderDataSource.paginator = this.paginator;
  }

  getKhataOrderData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'KhataOrderList').then((khataOrder) => {
      this.khataOrderList = khataOrder
      if (khataOrder && khataOrder.length > 0) {
        this.orderDataSource = new MatTableDataSource(this.khataOrderList);
      } else {
        this.khataOrderList = [];
        this.orderDataSource = new MatTableDataSource(this.khataOrderList);
      }
    }).catch((error) => {
      console.error('Error fetching khataOrder:', error);
    });
  }

  getKhataData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'KhataList').then((khata) => {
      this.khataList = khata
    }).catch((error) => {
      console.error('Error fetching khata:', error);
    });
  }

  transferOrder(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OrderListDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'KhataOrderList');
        this.getKhataOrderData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'KhataOrderList');
        this.getKhataOrderData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'KhataOrderList');
        this.getKhataOrderData();
      }
    });
  }

}