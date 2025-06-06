import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { IncomeDialogComponent } from './income-dialog/income-dialog.component';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})

export class IncomeComponent implements OnInit {

  incomeDataColumns: string[] = ['#','partyName','invoiceNo','type','invoiceDate','creditDate','amount' ];
  // incomeDataColumns: string[] = ['#','partyName','account','invoiceNo','invoiceDate','creditDate','amount','action' ];
  incomeList: any = [];
  companyAccountList: any = [];
  partyList: any = [];
  invoiceList: any = [];
  dateIncomeForm: FormGroup;
  incomeListArr: any = [];
  transferList: any = [];
  incomeMasterData: any = [];
  selectedPaibyId: any;

  incomeListDataSource = new MatTableDataSource(this.incomeList);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private fb: FormBuilder, private dialog: MatDialog, private commonService: CommonService) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateIncomeForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });
    this.getIncomeListData();
    this.getCompanyAccountData();
    this.getPartyData();
    this.getinvoiceData();
    this.getTransferData();
    this.getIncomeMasterList();
  }

  // ngAfterViewInit() {
  //   this.incomeListDataSource.paginator = this.paginator;
  // }

  applyFilter(filterValue: string): void {
    this.incomeListDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  filterDate() {
    if (!this.incomeMasterData) return;
    const startDate = this.dateIncomeForm.value.start ? new Date(this.dateIncomeForm.value.start) : null;
    const endDate = this.dateIncomeForm.value.end ? new Date(this.dateIncomeForm.value.end) : null;
    if (startDate && endDate) {
      this.incomeListDataSource.data = this.incomeMasterData.filter((invoice: any) => {
        if (!invoice.AmountDate) return false;
        const invoiceDate = new Date(invoice.AmountDate.seconds * 1000);
        invoiceDate.setHours(0, 0, 0);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else {
      this.incomeListDataSource.data = this.incomeMasterData;
    }
  }

  filterData() {
    this.incomeListDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        data.srNo || '',
        this.getPartyName(data.partyName) || '',
        // data.account || '',
        this.getInvoiceno(data.invoiceNo) || '',
        data.type || '',
        data.AmountDate || '',
        data.createddate || '',
        data.amount || ''
      ].join(' ').toLowerCase();

      return dataStr.includes(filter.trim().toLowerCase());
    };
    this.filterDate()
  }

  getIncomeListData() {
    this.commonService.fetchData('IncomeList', this.incomeList, this.incomeListDataSource).then((res) => {
      if (this.incomeList.length > 0)
        this.incomeListArr = this.incomeList;
      this.filterData();
    });
  }

  getIncomeMasterList() {
    this.commonService.fetchData('IncomeMasterList', this.incomeMasterData).then((res) => {
      if (this.incomeList.length > 0)
        this.incomeListArr = this.incomeList;
      this.filterData();
    });
    this.incomeListDataSource = new MatTableDataSource(this.incomeListArr);
      this.incomeListDataSource.paginator = this.paginator;
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }
  
  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getPartyName(partyName: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyName)?.firstName
  }

  getinvoiceData() {
    this.commonService.fetchData('InvoiceList', this.invoiceList);
  }

  getTransferData() {
    this.commonService.fetchData('TransferList', this.transferList).then((res) => {
    });
  }

  getInvoiceno(invoiceNo: string): string {
    return this.invoiceList.find((invoiceObj: any) => invoiceObj.id === invoiceNo)?.invoiceNo
  }

  paidbyChange(event: any) {
    this.incomeList = this.incomeListArr;
    this.selectedPaibyId = event.value;

    const paidbylist = this.incomeList.filter((paidbyObj: any) => paidbyObj.account === event.value)
    this.incomeList = paidbylist;
    this.incomeListDataSource.paginator = this.paginator;
    this.filterDate();
  }

  openIncome(action: string, obj: any) {
    const dialogRef = this.dialog.open(IncomeDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'IncomeList').then(() => this.getIncomeListData()).catch(console.error);
      }
    });
  }

  openTransfer(action:string , obj:any) {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      data: { ...obj, action },
      
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'TransferList').then(() => this.getTransferData()).catch(console.error);
      }
    });
  }
}