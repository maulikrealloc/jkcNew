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
import { EditchalanComponent } from './editchalan/editchalan.component';
import { ViewPDFdialogComponent } from './view-pdfdialog/view-pdfdialog.component';

@Component({
  selector: 'app-chalan',
  templateUrl: './chalan.component.html',
  styleUrls: ['./chalan.component.scss']
})

export class ChalanComponent implements OnInit {

  chalanForm: FormGroup;
  chalanDataColumns: string[] = ['srNo', 'partyOrder', 'productName', 'quantity', 'productPrice', 'chalanNo', 'totalAmount','action'];
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
  partyDetails: any;
  firmDetails: any;
  partyOrder: any;
  imageUrl: string | ArrayBuffer | null = null;
  updateProductsData: any;
  netAmount: number = 0;
  selectedPartyChalan = []
  isDisplayChalan: boolean = false;
  chalanListDataSource = new MatTableDataSource(this.chalanList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(
    private dialog: MatDialog, private fb: FormBuilder,
    private commonService: CommonService,
    private validationService : ValidationService) { }

  ngOnInit(): void {
    this.formBuild();
    this.getPartyData();
    this.getFirmData();
    this.productPriceTotal();
    this.chalanListDataSource.paginator = this.paginator;
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
    this.generatePDF()
    
    this.isDisplayChalan = true
  }

  // submitData() {
  //   const payload = {
  //     firmId: this.chalanForm.value.firm,
  //     partyId: this.chalanForm.value.party,
  //     partyOrderId: this.chalanForm.value.partyOrder,
  //     chalanDate: this.chalanForm.value.date,
  //     chalanNo: this.selectedPartyChalanNo,
  //     netAmount: this.chalanList.map((id:any) => id?.totalAmount).reduce((a:any, b:any) => a + b),
  //     isCreated: false,
  //   }
  //   this.updateProductsData.isCreated = true;

  //   this.firebaseCollectionService.updateDocument('CompanyList', this.updateProductsData.id, this.updateProductsData, 'OrderList');
  //   this.firebaseCollectionService.addDocument('CompanyList', payload, 'ChalanList');
  //   const chalanDateValue = this.chalanForm.value.date; 
  //   this.chalanForm.reset(); 
  //   this.chalanForm.patchValue({ date: chalanDateValue });
  //   ['firm', 'party', 'date', 'partyOrder', 'product'].forEach(ele => {
  //     this.chalanForm.controls[ele].setErrors(null)
  //   })
  //   this.chalanList = [];
  //   this.chalanListDataSource = new MatTableDataSource(this.chalanList);
  // }

  getPartyDetails(partyId: any) {
    this.partyDetails = this.partyList.find((id: any) => id.id === partyId);
  }

  getFirmDetails(firmId: any) {
    this.firmDetails = this.firmList.find((id: any) => id.id === firmId);
  }

  generatePDF() {
    this.getPartyDetails(this.chalanForm.value.party);
    this.getFirmDetails(this.chalanForm.value.firm);
    this.netAmount = this.chalanList.reduce((sum:any, item:any) => sum + item.totalAmount, 0);

    const url = this.validationService.generatePDF(
      this.partyDetails,
      this.firmDetails,
      this.chalanForm,
      this.partyOrder,
      this.imageUrl,
      this.netAmount,
      this.toWords
    );

    this.imageUrl = '';

    const payload = {
      url: url,
      partyDetails: this.partyDetails,
      firmDetails: this.firmDetails,
      chalanForm: this.chalanForm.value,
      partyOrder: this.partyOrder,
      imageUrl: this.imageUrl,
      netAmount: this.netAmount,
      toWords: this.toWords,
      selectedPartyChalanNo: this.selectedPartyChalanNo,
      chalanList: this.chalanList, 
      updateProductsData: this.updateProductsData
    };

    const dialogRef = this.dialog.open(ViewPDFdialogComponent, {
      width: '50%',
      data: { payload: payload }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.chalanForm.reset();
      this.chalanForm.controls['firm'].reset();
      this.chalanForm.controls['party'].reset();
      this.chalanForm.controls['partyOrder'].reset();
      this.chalanList = [];
      this.chalanListDataSource = new MatTableDataSource(this.chalanList);
      this.chalanListDataSource.paginator = this.paginator;
    });
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
    this.chalanList = []
    this.partyOrder = ''
    this.chalanListDataSource = new MatTableDataSource(this.chalanList);
    const seletedOrderProducts = this.orderList.find((id: any) => id.id === event.value)
    seletedOrderProducts.products.forEach((element: any) => {
      element.productChalanNo = this.selectedPartyChalanNo
      this.partyOrder = seletedOrderProducts.partyOrder
      const payload = {
        firm: this.chalanForm.value.firm,
        partyId: this.chalanForm.value.party,
        date: this.chalanForm.value.date,
        partyOrder: seletedOrderProducts.partyOrder,
        chalanNo: this.selectedPartyChalanNo,
        productName: element.productName,
        quantity: element.productQuantity,
        productPrice: element.productPrice,
        totalAmount: element.productQuantity * element.productPrice,
        productID: seletedOrderProducts.id
      }
      const product = {
        productName: element.productName,
        quantity: element.productQuantity,
        productPrice: element.productPrice,
        totalAmount: element.productQuantity * element.productPrice,
        productID: seletedOrderProducts.id,
        chalanNo: this.selectedPartyChalanNo
      }
      this.selectedProduct.push(product);
      this.chalanList.push(payload);
      this.chalanListDataSource = new MatTableDataSource(this.chalanList);
      this.chalanListDataSource.paginator = this.paginator;
    });
    this.updateProductsData = seletedOrderProducts;
  }

  getPartyName(partyId: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyId)?.firstName;
  }

  editChalanData(action: string, obj: any) {
    const dialogRef = this.dialog.open(EditchalanComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        
        const findOrder = this.orderList.find((order: any) => order.id === obj.productID);
        findOrder?.products.forEach((element: any) => {
          if (element.productName === result.data.productName) {
            element.productPrice = result.data.productPrice;
            element.productQuantity = result.data.quantity;
          }
        });

       
        const productIndex = this.chalanList.findIndex((item:any) =>
          item.productID === obj.productID && item.productName === result.data.productName
        );

        if (productIndex !== -1) {
          this.chalanList[productIndex].productPrice = result.data.productPrice;
          this.chalanList[productIndex].quantity = result.data.quantity;
          this.chalanList[productIndex].totalAmount = result.data.quantity * result.data.productPrice;
          
          const selectedProductIndex = this.selectedProduct.findIndex((item:any) =>
            item.productID === obj.productID && item.productName === result.data.productName
          );
          if (selectedProductIndex !== -1) {
            this.selectedProduct[selectedProductIndex].productPrice = result.data.productPrice;
            this.selectedProduct[selectedProductIndex].quantity = result.data.quantity;
            this.selectedProduct[selectedProductIndex].totalAmount = result.data.quantity * result.data.productPrice;
          }
        }

        const resultApi = {
          event: 'Edit',
          data: { ...findOrder, id: findOrder?.id },
        };

        this.commonService.commonApiCalled(resultApi, findOrder, 'OrderList').catch(console.error);

        this.chalanListDataSource = new MatTableDataSource(this.chalanList);
        this.chalanListDataSource.paginator = this.paginator;
      }
    });
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