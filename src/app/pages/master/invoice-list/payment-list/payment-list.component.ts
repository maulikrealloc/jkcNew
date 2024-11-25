import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../chalan-list/product-dialog/product-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent implements OnInit {
  displayedColumns: string[] = ['srNo', 'productPrice', 'totalAmount', 'action'];
  paymentReceiveList: FormGroup;
  action: string;
  local_data: any;
  invoiceList: any = [];
  paymentReciveList: any = [];
  paymentReceiveData: any = [];
  editIndex: number | null = null;

  paymentListDataSource = new MatTableDataSource(this.paymentReciveList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb: FormBuilder,
    private firebaseCollectionService: FirebaseCollectionService,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getPaymentReceiveList()    
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm();
    this.paymentListDataSource.paginator = this.paginator;
  }

  getPaymentReceiveList() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PaymentReceiveList').then((payment) => {
      this.paymentReceiveData = payment
      const datafind = this.paymentReceiveData?.find((id: any) => id.invoiceId === this.local_data.id)?.payments
      if (datafind) {
        datafind.forEach((element:any) => {
          const payload = {
            paymentReceive: element.paymentReceive,
            paymentDate: new Date(element.paymentDate).toLocaleDateString(),
          };
          this.paymentReciveList.push(payload)
        });
        this.paymentListDataSource.data = [...this.paymentReciveList];
      }
    })
  }

  buildForm() {
    this.paymentReceiveList = this.fb.group({
      paymentReceive: ['', Validators.required],
      paymentDate: [new Date(), Validators.required]
    });
  }

  addPaymentData() {
    const paymentDateValue = this.paymentReceiveList.value.paymentDate;
    const payload = {
      paymentReceive: this.paymentReceiveList.value.paymentReceive,
      paymentDate: new Date(this.paymentReceiveList.value.paymentDate).toLocaleDateString(),
    };

    if (this.editIndex !== null) {
      this.paymentReciveList[this.editIndex] = payload;
      this.editIndex = null;
    } else {
      this.paymentReciveList.push(payload);
    }

    this.paymentListDataSource.data = [...this.paymentReciveList];
    this.paymentReceiveList.patchValue({ paymentDate: paymentDateValue });
    this.paymentReceiveList.controls['paymentReceive'].reset();
  }

  editData(index: number) {
    const selectedData = this.paymentReciveList[index];
    this.paymentReceiveList.patchValue({
      paymentReceive: selectedData.paymentReceive,
      paymentDate: new Date(selectedData.paymentDate),
    });
    this.editIndex = index;
  }

  submitPayment() {
    const payload = {
      invoiceId: this.local_data.id,
      finalAmount: this.data?.finalAmount ,
      payments: this.paymentListDataSource.data ,
    }
    const datafind = this.paymentReceiveData?.find((id: any) => id.invoiceId === this.local_data.id)?.payments
    if (datafind?.length > 0) {
      this.firebaseCollectionService.updateDocument('CompanyList', this.paymentReceiveData?.find((id: any) => id.invoiceId === this.local_data.id).id, payload, 'PaymentReceiveList');
    } else {
      this.firebaseCollectionService.addDocument('CompanyList', payload, 'PaymentReceiveList');    
    }
  }

  deleteData(index: number) {
    this.paymentReciveList.splice(index, 1);
    this.paymentListDataSource.data = [...this.paymentReciveList];
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  pendingAmount(): string {
    const totalReceived = this.paymentReciveList.reduce((total: number, item: any) => total + Number(item.paymentReceive), 0);
    const pendingAmount = Number(this.data?.finalAmount) - totalReceived;
    return pendingAmount.toFixed(2);
  }

}
