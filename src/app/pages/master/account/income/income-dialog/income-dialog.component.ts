import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import de from 'date-fns/esm/locale/de/index.js';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-income-dialog',
  templateUrl: './income-dialog.component.html',
  styleUrls: ['./income-dialog.component.scss']
})
  
export class IncomeDialogComponent implements OnInit {

  incomeForm: FormGroup;
  action: string;
  local_data: any;
  companyAccountList: any = [];
  incomeMasterData: any = [];
  partyList: any = [];
  invoiceList: any = [];
  filteredInvoiceList: any = [];
  
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private firebaseCollectionService: FirebaseCollectionService,
    public dialogRef: MatDialogRef<IncomeDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.incomegroup(this.action === 'Edit' ? this.local_data : undefined);
    this.getCompanyAccountData();
    this.getIncomeMasterList();
    this.getPartyData();
    this.getinvoiceData();
  }

  incomegroup(data:any) {
    this.incomeForm = this.fb.group({
      partyName: [data ? data?.partyName : '', Validators.required],
      account: [data ? data?.account : '', Validators.required],
      invoiceNo: [data ? data?.invoiceNo : '', Validators.required],
      invoiceDate: [data ? this.convertTimestampToDate(data?.invoiceDate): new Date()],
      creditDate: [data ? this.convertTimestampToDate(data?.creditDate) : new Date()],
      amount: [data ? data?.amount : '', Validators.required]
    })
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }

  getIncomeMasterList() {
    this.commonService.fetchData('IncomeMasterList', this.incomeMasterData);
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getinvoiceData() {
    this.commonService.fetchData('InvoiceList', this.invoiceList).then((res) => {
      console.log(this.invoiceList);
      
    });
  }

  doAction() {
    const payload = this.incomeForm.value
  
    const datafindIncome = this.incomeMasterData?.find((id: any) => id.invoiceId === this.local_data.id);
    const IncomeMaster = {
      type:"Other",
      description: "demo",
      createddate: new Date(),
      AmountDate: this.incomeForm.value.invoiceDate ,
      Amount: this.incomeForm.value.amount , 
    };
    if (datafindIncome?.payments?.length > 0) {
      this.firebaseCollectionService.updateDocument('CompanyList', datafindIncome.id, IncomeMaster, 'IncomeMasterList');
    } else {
      this.firebaseCollectionService.addDocument('CompanyList', IncomeMaster, 'IncomeMasterList');
    }
    this.dialogRef.close({ event: this.action, data: payload })
  }

  partyChange(event: any) {
    const selectedPartyId = event.value;
    this.filteredInvoiceList = this.invoiceList.filter((invoice: any) =>
      invoice.partyId === selectedPartyId
    );
  }

  closeDialog() {
    this.dialogRef.close({ event: 'cancel' })
  }
  
  invoiceChange(event: any) {
    const selectedInvoiceId = event.value;
    const selectedInvoice = this.invoiceList.find((invoice: any) => invoice.id === selectedInvoiceId);

    if (selectedInvoice) {
      let totalAmount = 0;
      if (selectedInvoice.paymentReceiveAmount && selectedInvoice.paymentReceiveAmount.length > 0) {
        totalAmount = selectedInvoice.paymentReceiveAmount.reduce((sum: number, payment: any) => {
          return sum + (payment.amount || 0);
        }, 0);
      }

      let invoiceDate = new Date();
      if (selectedInvoice.paymentReceiveAmount && selectedInvoice.paymentReceiveAmount.length > 0) {
        const payment = selectedInvoice.paymentReceiveAmount[0];
        if (payment.date && payment.date.seconds) {
          invoiceDate = new Date(payment.date.seconds * 1000);
        }
      } else if (selectedInvoice.date && selectedInvoice.date.seconds) {
        invoiceDate = new Date(selectedInvoice.date.seconds * 1000);
      }

      this.incomeForm.patchValue({
        amount: totalAmount,
        invoiceDate: invoiceDate
      });
    }
  }
}