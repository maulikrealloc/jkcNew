import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-chalan',
  templateUrl: './chalan.component.html',
  styleUrls: ['./chalan.component.scss']
})
export class ChalanComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  chalanForm: FormGroup;
  chalanColumns: string[] = [
    '#',
    'partyOrder',
    'productName',
    'quantity',
    'productPrice',
    'chalanNo',
    'totalAmount',
    'action'
  ];
  employee: any = [
    {
      id: 1,
      partyOrder: 'Demo',
      productName: 'demo',
      quantity: '10',
      productPrice: '999',
      chalanNo: '12',
      totalAmount: '9990'
    }
  ];

  khataListdataSource = new MatTableDataSource(this.employee);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.formBuild()
  }

  formBuild() {
    this.chalanForm = this.fb.group({
      id: [''],
      firm: ['ABC', Validators.required],
      party: ['ABC', Validators.required],
      date: new Date(),
      partyOrder: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      productName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      srNo: [''],
      quantity: ['', Validators.required],
      totalAmount: [''],
      productPrice: ['', Validators.required],
      chalanNo: ['', Validators.required],
    })
  }

  ngAfterViewInit(): void {
    this.khataListdataSource.paginator = this.paginator;
  }

  doAction() {
    const payload = {
      id: this.employee.length + 1,
      firm: this.chalanForm.value.firm,
      party: this.chalanForm.value.party,
      date: this.chalanForm.value.date,
      partyOrder: this.chalanForm.value.partyOrder,
      productName: this.chalanForm.value.productName,
      srNo: this.chalanForm.value.srNo,
      quantity: this.chalanForm.value.quantity,
      totalAmount: this.chalanForm.value.totalAmount,
      productPrice: this.chalanForm.value.productPrice,
      chalanNo: this.chalanForm.value.chalanNo
    }

    this.employee.push(payload)
    this.khataListdataSource = new MatTableDataSource(this.employee);

    ['firm', 'party', 'partyOrder', 'productName', 'quantity', 'productPrice', 'chalanNo'].forEach(controlName => {
      this.chalanForm.controls[controlName].clearValidators();
      this.chalanForm.controls[controlName].updateValueAndValidity();
    });
    this.chalanForm.reset();
    console.log(payload);

  }

  updateData(data: any, i: number) {
    this.chalanForm.patchValue(data)
    this.chalanForm.controls['id'].setValue(data.id)
    this.chalanForm.controls['partyOrder'].setValue(data.partyOrder)
    this.chalanForm.controls['productName'].setValue(data.productName)
    this.chalanForm.controls['quantity'].setValue(data.quantity)
    this.chalanForm.controls['productPrice'].setValue(data.productPrice)
    this.chalanForm.controls['chalanNo'].setValue(data.chalanNo)
    this.chalanForm.controls['totalAmount'].setValue(data.totalAmount)
    this.employee.splice(i, 1);
    this.khataListdataSource = new MatTableDataSource(this.employee);
  }

  deleteData(index: number) {
    this.employee.splice(index, 1);
    this.khataListdataSource = new MatTableDataSource(this.employee);
  }


}
