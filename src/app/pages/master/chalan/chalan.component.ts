import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { ToWords } from 'to-words';
import { ChalanViewDialogComponent } from './chalan-view-dialog/chalan-view-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-chalan',
  templateUrl: './chalan.component.html',
  styleUrls: ['./chalan.component.scss']
})

export class ChalanComponent implements OnInit {

  chalanForm: FormGroup;
  chalanDataColumns: string[] = [ 'srNo', 'partyOrder', 'productName', 'quantity', 'productPrice', 'chalanNo', 'totalAmount'];
  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  chalanList: any = [];
  partyList: any = [];
  firmList: any = [];
  orderList: any = [];
  quantityValue: any = 0;
  productPriceValue: any = 0;
  totalProductPrices: any;
  selectedPartyChalanNo: number = 0;
  selectedProduct: any = [];
  chalanListDataSource = new MatTableDataSource(this.chalanList);
  partyDetails: any;
  firmDetails: any;
  partyOrder: any;
  imageUrl: string | ArrayBuffer | null = null;
  updateProductsData: any;
  netAmount: number = 0;
  selectedPartyChalan = []
  isDisplayChalan: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(
    private dialog: MatDialog, private fb: FormBuilder,
    private commonService: CommonService,
    private validationService : ValidationService,
    private firebaseCollectionService: FirebaseCollectionService) { }

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
      product: [this.selectedProduct]
    });
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  getFirmData() {
    this.commonService.fetchData('FirmList', this.firmList);
  }

  viewpdf() {
    this.getPartyDetails(this.chalanForm.value.party)
    this.getFirmDetails(this.chalanForm.value.firm)
    this.generatePDF();
    this.isDisplayChalan = true
  }

  openProductViewData(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(ChalanViewDialogComponent, {
      data: obj,
    });
  }

  submitData() {
    const payload = {
      firmId: this.chalanForm.value.firm,
      partyId: this.chalanForm.value.party,
      partyOrderId: this.chalanForm.value.partyOrder,
      chalanDate: this.chalanForm.value.date,
      chalanNo: this.selectedPartyChalanNo,
      netAmount: this.chalanList.map((id:any) => id?.totalAmount).reduce((a:any, b:any) => a + b),
      isCreated: false,
    }
    this.updateProductsData.isCreated = true;

    this.firebaseCollectionService.updateDocument('CompanyList', this.updateProductsData.id, this.updateProductsData, 'OrderList');
    this.firebaseCollectionService.addDocument('CompanyList', payload, 'ChalanList');

    this.chalanForm.reset();
    ['firm', 'party', 'date', 'partyOrder', 'product'].forEach(ele => {
      this.chalanForm.controls[ele].setErrors(null)
    })
    this.chalanList = [];
    this.chalanListDataSource = new MatTableDataSource(this.chalanList);
  }

  getPartyDetails(partyId: any) {
    this.partyDetails = this.partyList.find((id: any) => id.id === partyId);
  }

  getFirmDetails(firmId: any) {
    this.firmDetails = this.firmList.find((id: any) => id.id === firmId);
  }

  generatePDF() {
    this.validationService.generatePDF(this.partyDetails, this.firmDetails, this.chalanForm, this.partyOrder, this.imageUrl, this.netAmount, this.toWords)
    this.imageUrl = ''
  }

  partyChange(event: any) {
    this.commonService.fetchData('ChalanList', this.selectedPartyChalan).then((chalan) => {
      const chalanData = this.selectedPartyChalan.filter((chalanObj: any) => chalanObj.partyId === event.value);
      const maxChalanNo = chalanData.length > 0 ? Math.max(...chalanData.map((chalanObj: any) => Number(chalanObj.chalanNo) || 0)) + 1 : Number(this.partyList.find((partyObj: any) => partyObj.id === event.value).chalanNoSeries) || 0;
      this.selectedPartyChalanNo = maxChalanNo;
    })
    
    this.commonService.fetchData('OrderList', this.orderList).then((order) => {
      this.orderList = this.orderList.filter((id: any) => id.partyId === event?.value && id.orderStatus === 'Done' && id.isCreated === false)
    })
  }

  orderChange(event: any) {
    this.chalanList = [];
    this.partyOrder = '';

    const selectedOrder = this.orderList.find((order: any) => order.id === event.value);
    if (!selectedOrder) return;

    const { firm, party, date } = this.chalanForm.value;
    this.partyOrder = selectedOrder.partyOrder;

    this.chalanList = selectedOrder.products.map(({ productName, productQuantity, productPrice }: any) => {
      const totalAmount = productQuantity * productPrice;
      const productData = { productName, quantity: productQuantity, productPrice, totalAmount, productID: selectedOrder.id, chalanNo: this.selectedPartyChalanNo };

      this.selectedProduct.push(productData);
      return { firm, partyId: party, date, partyOrder: this.partyOrder, ...productData };
    });

    this.chalanListDataSource = new MatTableDataSource(this.chalanList);
    this.updateProductsData = selectedOrder;
    this.chalanListDataSource.paginator = this.paginator;
  }

  getPartyName(partyId: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyId)?.firstName;
  }

  deleteData(index: number) {
    this.chalanList.splice(index, 1);
    this.selectedProduct.splice(index, 1);
    this.chalanListDataSource = new MatTableDataSource(this.chalanList);
  }

  productPriceTotal() {
    this.totalProductPrices = this.quantityValue * this.productPriceValue;
    this.chalanForm.get('totalAmount')?.setValue(this.totalProductPrices);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

}