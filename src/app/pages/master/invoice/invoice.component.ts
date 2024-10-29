import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  invoiceList = [
    {
      id: 1,
      productName: 'Demo',
      productPrice: 'Test',
      quantity: 2000,
      chalanNo: 9876543210,
      totalAmount: 9876543210,
      finalAmount: 9876543210
    }
  ];
  invoiceForm: FormGroup;
  firmList: any = [];
  partyList: any = [];
  chalanList: any = [];
  chalanData: any = [];
  partyDetails: any;


  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  invoiceColumns: string[] = [
    'srNo',
    'productName',
    'productPrice',
    'quantity',
    'chalanNo',
    'totalAmount',
    'finalAmount',
    'action',
  ];

  invoiceListdataSource = new MatTableDataSource(this.invoiceList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private fb: FormBuilder,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getFirmData();
    this.getPartyData();
    this.getChalanData();

  }

  buildForm() {
    this.invoiceForm = this.fb.group({
      firm: ['', Validators.required],
      party: ['', Validators.required],
      chalanNo: ['', Validators.required],
      date: new Date(),
      invoiceNo: [''],
      cgst: [''],
      sgst: [''],
      discountRatio: ['']
    })
  }

  ngAfterViewInit(): void {
    this.invoiceListdataSource.paginator = this.paginator;

  }

  getFirmData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'FirmList').then((firms: string | any[]) => {
      if (firms && firms.length > 0) {
        this.firmList = firms
      }
    }).catch((error: any) => {
      console.error('Error fetching firms:', error);
    });
  }
  
  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      if (party && party.length > 0) {
        this.partyList = party
      }
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  getChalanData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'ChalanList').then((chalan) => {
      if (chalan && chalan.length > 0) {
        this.chalanData = chalan
      }
    }).catch((error) => {
      console.error('Error fetching chalan:', error);
    });
  }

  firmChange(event : any) {
    this.chalanList = this.chalanData.filter((obj: any) => obj.firmId === event.value)
  }

  partyChange(event : any) {
    this.chalanList = this.chalanData.filter((id: any) => id.partyId === event.value)
  }

  invoiceview() {
    const payload = {
      firm: this.invoiceForm.value.firm,
      party: this.invoiceForm.value.party,
      chalanNo: this.invoiceForm.value.chalanNo,
      date: this.invoiceForm.value.date,
      invoiceNo: this.invoiceForm.value.invoiceNo,
      cgst: this.invoiceForm.value.cgst,
      sgst: this.invoiceForm.value.sgst,
      discountRatio: this.invoiceForm.value.discountRatio
    }
  }
  
}
