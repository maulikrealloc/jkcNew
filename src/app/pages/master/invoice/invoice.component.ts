import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
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
    console.log(payload, "payload===========>>>>>>>>>");
  }
}
