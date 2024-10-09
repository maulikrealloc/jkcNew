import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';



@Component({
  selector: 'app-chalan',
  templateUrl: './chalan.component.html',
  styleUrls: ['./chalan.component.scss']
})
export class ChalanComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  chalanForm: FormGroup;
  chalanColumns: string[] = [
    'srNo',
    'partyOrder',
    'productName',
    'quantity',
    'productPrice',
    'chalanNo',
    'totalAmount',
    'action'
  ];
  chalanList: any = [];
  partyList: any = [];
  firmList: any = [];
  orderList: any = [];

  quantityValue: any = 0;
  productPriceValue: any = 0;
  totalProductPrices : any;
  selectedPartyChalanNo : number = 0
  selectedProduct : any = []
  chalanListdataSource = new MatTableDataSource(this.chalanList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb: FormBuilder,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.formBuild();
    this.getPartyData();
    this.getFirmData();
    this.productPriceTotal();
  }

  formBuild() {
    this.chalanForm = this.fb.group({
      firm: ['', Validators.required],
      party: ['', Validators.required],
      date: new Date(),
      partyOrder: ['', Validators.required],
      product : [this.selectedProduct]
    })
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

  getFirmData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'FirmList').then((firms) => {
      if (firms && firms.length > 0) {
        this.firmList = firms
      }
    }).catch((error) => {
      console.error('Error fetching firms:', error);
    });
  }

  viewpdf(){
    console.log('=====chalanForm>>' ,this.chalanForm.value);
    
  }

  partyChange(event: any) {
    this.selectedPartyChalanNo = this.partyList.find((partyObj: any) => partyObj.id === event.value).chalanNoSeries

    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      if (order && order.length > 0) {
        this.orderList = order.filter(id => id.partyId === event?.value)
      }
      console.log(this.orderList);

    }).catch((error) => {
      console.error('Error fetching order:', error);
    });
  }

  orderChange(event: any) {
    this.chalanList = []
    this.chalanListdataSource = new MatTableDataSource(this.chalanList);
    const seletedOrderProducts = this.orderList.find((id: any) => id.id === event.value)
      seletedOrderProducts.products.forEach((element: any) => {
        const payload = {
          firm: this.chalanForm.value.firm,
          partyId: this.chalanForm.value.party,
          date: this.chalanForm.value.date,
          partyOrder: seletedOrderProducts.partyOrder,
          chalanNo: this.selectedPartyChalanNo,
          productName : element.productName,
          quantity : element.productQuantity,
          productPrice : element.productPrice,
          totalAmount :  element.productQuantity * element.productPrice,
          productID : seletedOrderProducts.id
        }
        const product = {
          productName : element.productName,
          quantity : element.productQuantity,
          productPrice : element.productPrice,
          totalAmount :  element.productQuantity * element.productPrice,
          productID : seletedOrderProducts.id,
          chalanNo: this.selectedPartyChalanNo
        }
        this.selectedProduct.push(product)
        this.chalanList.push(payload)
        this.chalanListdataSource = new MatTableDataSource(this.chalanList);
      });
  }

  ngAfterViewInit(): void {
    this.chalanListdataSource.paginator = this.paginator;
  }

  doAction() {
    const payload = {
      firm: this.chalanForm.value.firm,
      partyId: this.chalanForm.value.party,
      date: this.chalanForm.value.date,
      partyOrder: this.chalanForm.value.partyOrder,
      // productName: this.chalanForm.value.productName,
      // srNo: this.chalanForm.value.srNo,
      // quantity: this.chalanForm.value.quantity,
      // totalAmount: this.chalanForm.value.totalAmount,
      // productPrice: this.chalanForm.value.productPrice,
      // chalanNo: this.chalanForm.value.chalanNo
    }
    this.chalanList.push(payload)
    this.chalanListdataSource = new MatTableDataSource(this.chalanList);

    ['firm', 'party', 'partyOrder', 'productName', 'quantity', 'productPrice', 'chalanNo'].forEach(controlName => {
      this.chalanForm.controls[controlName].clearValidators();
      this.chalanForm.controls[controlName].updateValueAndValidity();
    });
  }

  // updateData(data: any, i: number) {
  //   this.chalanForm.patchValue(data)
  //   this.chalanForm.controls['id'].setValue(data.id)
  //   this.chalanForm.controls['partyOrder'].setValue(data.partyOrder)
  //   this.chalanForm.controls['productName'].setValue(data.productName)
  //   this.chalanForm.controls['quantity'].setValue(data.quantity)
  //   this.chalanForm.controls['productPrice'].setValue(data.productPrice)
  //   this.chalanForm.controls['chalanNo'].setValue(data.chalanNo)
  //   this.chalanForm.controls['totalAmount'].setValue(data.totalAmount)
  //   this.chalanList.splice(i, 1);
  //   this.chalanListdataSource = new MatTableDataSource(this.chalanList);
  // }
  getPartyName(partyId: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyId)?.firstName
  }

  deleteData(index: number) {
    this.chalanList.splice(index, 1);
    this.selectedProduct.splice(index ,1)
    this.chalanListdataSource = new MatTableDataSource(this.chalanList);
  }

  productPriceTotal(){
    this.totalProductPrices = this.quantityValue * this.productPriceValue;
    this.chalanForm.get('totalAmount')?.setValue(this.totalProductPrices);
  }

}
