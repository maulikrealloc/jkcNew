import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

const khataList = [
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
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  invoiceForm: FormGroup;
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);


  khataColumns: string[] = [
    '#',
    'productName',
    'productPrice',
    'quantity',
    'chalanNo',
    'totalAmount',
    'finalAmount',
    'action',
  ];



  khataListdataSource = new MatTableDataSource(khataList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.invoiceForm = this.fb.group({
      firm: [''],
      party: [''],
      chalanNo: [''],
      date: new Date(),
      invoiceNo: [''],
      cgst: [''],
      sgst: [''],
      discountRatio: ['']
    })
  }

  ngAfterViewInit(): void {
    this.khataListdataSource.paginator = this.paginator;

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
    console.log(this.invoiceForm.value);

  }
}
