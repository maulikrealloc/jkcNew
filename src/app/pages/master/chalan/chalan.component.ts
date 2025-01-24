import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { ToWords } from 'to-words';
import { ChalanViewDialogComponent } from './chalan-view-dialog/chalan-view-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chalan',
  templateUrl: './chalan.component.html',
  styleUrls: ['./chalan.component.scss']
})

export class ChalanComponent implements OnInit {

  chalanForm: FormGroup;
  chalanDataColumns: string[] = [
    'srNo',
    'partyOrder',
    'productName',
    'quantity',
    'productPrice',
    'chalanNo',
    'totalAmount'
  ];
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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(
    private dialog: MatDialog, private fb: FormBuilder,
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

  viewpdf() {
    this.getPartyDetails(this.chalanForm.value.party)
    this.getFirmDetails(this.chalanForm.value.firm)
    this.generatePDF();
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
      netAmount: this.netAmount,
      isCreated: false,
    }
    this.updateProductsData.isCreated = true;
    this.firebaseCollectionService.updateDocument('CompanyList', this.updateProductsData.id, this.updateProductsData, 'OrderList');
    this.firebaseCollectionService.addDocument('CompanyList', payload, 'ChalanList');
    this.chalanForm.reset();
    this.chalanForm.controls['firm'].setErrors(null)
    this.chalanForm.controls['party'].setErrors(null)
    this.chalanForm.controls['date'].setErrors(null)
    this.chalanForm.controls['partyOrder'].setErrors(null)
    this.chalanForm.controls['product'].setErrors(null)
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
    const { tr, tg, tb } = this.textHexToRgb(this.partyDetails.partyColorCode.fontColor);
    const { br, bg, bb } = this.bgHexToRgb(this.partyDetails.partyColorCode.bgColor);
    const doc = new jsPDF();

    const addContent = () => {

      const margin = 5;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

      doc.setFontSize(10);
      doc.text(`MO: ${this.firmDetails?.mobileNO.toString()}`, margin + 8, margin + 8);
      if (this.firmDetails?.personalMobileNo) {
        doc.text(`MO: ${this.firmDetails?.personalMobileNo.toString()}`, pageWidth - margin - 35, margin + 8);
      }

      doc.setTextColor(br, bg, bb);
      doc.setFont('helvetica', 'bold');
      const title = this.firmDetails.header;
      doc.setFontSize(22);
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, margin + 20);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      const address = this.firmDetails.address;
      const addressY = margin + 38;
      doc.setFontSize(10);

      const addressLines = doc.splitTextToSize(address, pageWidth - 2 * margin);

      addressLines.forEach((line: any, index: number) => {
        const addressX = (pageWidth - doc.getTextWidth(line)) / 2;
        doc.text(line, addressX, addressY + (index * 5));
      });

      const details = this.firmDetails.subHeader;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      const detailsWidth = doc.getTextWidth(details);
      const detailsX = (pageWidth - detailsWidth) / 2;
      doc.text(details, detailsX, addressY - 24 + addressLines.length * 5 + 10);

      const leftColumnX = margin + 5;
      const rightColumnX = pageWidth - margin - 55;
      const startY = addressY + addressLines.length * 5 + 12;

      const partyaddress = `Address: ${this.partyDetails.partyAddress}`;
      doc.setFontSize(11);

      const partyaddressLines = doc.splitTextToSize(partyaddress, 100 - 2 * margin);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(br, bg, bb);
      doc.text(`To: ${this.partyDetails?.firstName + this.partyDetails.lastName}`, leftColumnX + 4, startY);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      partyaddressLines.forEach((line: any, index: number) => {
        doc.text(line, leftColumnX + 4, startY + 5 + (index * 5));
      });

      const chalanSpacing = 6;
      const startChalanY = startY;
      doc.setFontSize(14);
      doc.setTextColor(br, bg, bb);
      doc.setFont('helvetica', 'bold');
      doc.text(`Chalan No: ${this.chalanForm.value.product[0].chalanNo}`, rightColumnX + 5, startChalanY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const formattedDate = moment(this.chalanForm.value.date).format('DD/MM/YYYY');
      doc.text(`Date: ${formattedDate}`, rightColumnX + 5, startChalanY + chalanSpacing);
      doc.text(`PO No: ${this.partyOrder}`, rightColumnX + 5, startChalanY + chalanSpacing * 2);
      doc.setFontSize(11);

      const products = this.chalanForm.value.product;

      const totalRows = 10;
      const emptyRowsNeeded = totalRows - products.length;

      const emptyRows = Array.from({ length: emptyRowsNeeded }, (_, index) => [
        (products.length + index + 1).toString(),
        '',
        '',
        '',
        ''
      ]);

      const tableData = [
        ...products.map((p: any, index: number) => [
          (index + 1).toString(),
          p.productName,
          p.quantity,
          p.productPrice,
          p.totalAmount
        ]),
        ...emptyRows
      ];

      this.netAmount = products.reduce((sum: any, p: any) => sum + p.totalAmount, 0);

      tableData.push([
        '', 
        'Net Amount',
        '',
        '',
        this.netAmount.toFixed(2) + '/-'
      ]);

      autoTable(doc, {
        head: [['Sr.', 'Particulars', 'Pcs./Mts.', 'Rate', 'Amount']],
        body: tableData,
        startY: startY + 17,
        styles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 12,
          font: 'helvetica',
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.50,
        },
        headStyles: {
          fillColor: [br, bg, bb],
          textColor: [tr, tg, tb],
          fontSize: 12,
          font: 'helvetica',
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 92 },
          2: { cellWidth: 24 },
          3: { cellWidth: 17 },
          4: { cellWidth: 37 },
        },
        didParseCell: function (data) {
          const rowIndex = data.row.index;
          if (data.section === 'body' && data.column.index === 4) {
            if (rowIndex === 10) {
              data.cell.styles.fontSize = 15;
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      const firstTableY = (doc as any).lastAutoTable.finalY;
      autoTable(doc, {
        head: [['GST', 'In Word']],
        body: [
          [this.firmDetails.GSTNo, this.toWords.convert(this.netAmount)],
        ],
        startY: firstTableY + 3,
        styles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 10,
          cellPadding: 2,
          lineColor: [200, 200, 200],
          lineWidth: 0.45,
          fontStyle: 'bold',
        },
        headStyles: {
          fillColor: [br, bg, bb],
          textColor: [tr, tg, tb],
          fontSize: 9,
          font: 'helvetica',
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 38 },
          1: { cellWidth: 144, overflow: 'linebreak' },
        },
        didParseCell: function (data) {
          if (data.section === 'body' && data.column.index === 2) {
            data.cell.styles.fontSize = 14;
          }
        },
      });

      const tableY = (doc as any).lastAutoTable.finalY;
      const signatureY = tableY + 5;
      const imgWidth = 100;
      const imgHeight = 50;
      const imgData: any = this.imageUrl;
      if (this.imageUrl) {
        doc.addImage(imgData, 'PNG', margin + 8, signatureY, imgWidth, imgHeight);
      }
      doc.text('Signature', pageWidth - margin - 50, signatureY + 20 + imgHeight / 2);

      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      const footerY = doc.internal.pageSize.getHeight() - 12;
      const footerText = `Thank you for your business "${this.partyDetails?.firstName + this.partyDetails.lastName}"`;
      const footerTextWidth = doc.getTextWidth(footerText);
      const footerTextX = (pageWidth - footerTextWidth) / 2;
      doc.setTextColor(0, 0, 0);
      doc.text(footerText, footerTextX, footerY + 4);
    };

    const addBlackWhiteContent = () => {

      const margin = 5;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`MO: ${this.firmDetails?.mobileNO.toString()}`, margin + 8, margin + 8);
      if (this.firmDetails?.personalMobileNo) {
        doc.text(`MO: ${this.firmDetails?.personalMobileNo.toString()}`, pageWidth - margin - 35, margin + 8);
      }

      doc.setTextColor(2, 2, 2);
      doc.setFont('helvetica', 'bold');
      const title = this.firmDetails.header;
      doc.setFontSize(22);
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, margin + 20);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      const address = this.firmDetails.address;
      const addressY = margin + 38;
      doc.setFontSize(10);

      const addressLines = doc.splitTextToSize(address, pageWidth - 2 * margin);

      addressLines.forEach((line: any, index: number) => {
        const addressX = (pageWidth - doc.getTextWidth(line)) / 2;
        doc.text(line, addressX, addressY + (index * 5));
      });

      const details = this.firmDetails.subHeader;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      const detailsWidth = doc.getTextWidth(details);
      const detailsX = (pageWidth - detailsWidth) / 2;
      doc.text(details, detailsX, addressY - 24 + addressLines.length * 5 + 10);

      const leftColumnX = margin + 5;
      const rightColumnX = pageWidth - margin - 55;
      const startY = addressY + addressLines.length * 5 + 12;

      const partyaddress = `Address: ${this.partyDetails.partyAddress}`;
      doc.setFontSize(11);

      const partyaddressLines = doc.splitTextToSize(partyaddress, 100 - 2 * margin);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(2, 2, 2);
      doc.text(`To: ${this.partyDetails?.firstName + this.partyDetails.lastName}`, leftColumnX + 4, startY);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      partyaddressLines.forEach((line: any, index: number) => {
        doc.text(line, leftColumnX + 4, startY + 5 + (index * 5));
      });

      const chalanSpacing = 6;
      const startChalanY = startY;
      doc.setFontSize(14);
      doc.setTextColor(2, 2, 2);
      doc.setFont('helvetica', 'bold');
      doc.text(`Chalan No: ${this.chalanForm.value.product[0].chalanNo}`, rightColumnX + 5, startChalanY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const formattedDate = moment(this.chalanForm.value.date).format('DD/MM/YYYY');
      doc.text(`Date: ${formattedDate}`, rightColumnX + 5, startChalanY + chalanSpacing);
      doc.text(`PO No: ${this.partyOrder}`, rightColumnX + 5, startChalanY + chalanSpacing * 2);
      doc.setFontSize(11);

      const products = this.chalanForm.value.product;

      const totalRows = 10;
      const emptyRowsNeeded = totalRows - products.length;

      const emptyRows = Array.from({ length: emptyRowsNeeded }, (_, index) => [
        (products.length + index + 1).toString(),
        '',
        '',
        '',
        ''
      ]);

      const tableData = [
        ...products.map((p: any, index: number) => [
          (index + 1).toString(),
          p.productName,
          p.quantity,
          p.productPrice,
          p.totalAmount
        ]),
        ...emptyRows
      ];

      const netAmount = products.reduce((sum: any, p: any) => sum + p.totalAmount, 0);

      tableData.push([
        '',
        'Net Amount',
        '',
        '',
        netAmount.toFixed(2) + '/-'
      ]);

      autoTable(doc, {
        head: [['Sr.', 'Particulars', 'Pcs./Mts.', 'Rate', 'Amount']],
        body: tableData,
        startY: startY + 17,
        styles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 12,
          font: 'helvetica',
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.50,
        },
        headStyles: {
          fillColor: [2, 2, 2],
          textColor: [255, 255, 255],
          fontSize: 12,
          font: 'helvetica',
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 92 },
          2: { cellWidth: 24 },
          3: { cellWidth: 17 },
          4: { cellWidth: 37 },
        },
        didParseCell: function (data) {
          const rowIndex = data.row.index;
          if (data.section === 'body' && data.column.index === 4) {
            if (rowIndex === 10) {
              data.cell.styles.fontSize = 15;
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      const firstTableY = (doc as any).lastAutoTable.finalY;
      autoTable(doc, {
        head: [['GST', 'In Word']],
        body: [
          [this.firmDetails.GSTNo, this.toWords.convert(netAmount)],
        ],
        startY: firstTableY + 3,
        styles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 10,
          cellPadding: 2,
          lineColor: [200, 200, 200],
          lineWidth: 0.45,
          fontStyle: 'bold',
        },
        headStyles: {
          fillColor: [2, 2, 2],
          textColor: [255, 255, 255],
          fontSize: 9,
          font: 'helvetica',
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        columnStyles: {
          0: { cellWidth: 38 },
          1: { cellWidth: 144, overflow: 'linebreak' },
        },
        didParseCell: function (data) {
          if (data.section === 'body' && data.column.index === 2) {
            data.cell.styles.fontSize = 14;
          }
        },
      });

      const tableY = (doc as any).lastAutoTable.finalY;
      const signatureY = tableY + 5;
      const imgWidth = 100;
      const imgHeight = 50;
      const imgData: any = this.imageUrl;
      if (this.imageUrl) {
        doc.addImage(imgData, 'PNG', margin + 8, signatureY, imgWidth, imgHeight);
      }
      doc.text('Signature', pageWidth - margin - 50, signatureY + 20 + imgHeight / 2);

      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      const footerY = doc.internal.pageSize.getHeight() - 12;
      const footerText = `Thank you for your business "${this.partyDetails?.firstName + this.partyDetails.lastName}"`;
      const footerTextWidth = doc.getTextWidth(footerText);
      const footerTextX = (pageWidth - footerTextWidth) / 2;
      doc.setTextColor(0, 0, 0);
      doc.text(footerText, footerTextX, footerY + 4);
    };

    doc.setFont("helvetica", "normal");
    addContent();
    doc.addPage();
    addBlackWhiteContent();

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
    this.imageUrl = ''
  }

  textHexToRgb(hex: any) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const tr = (bigint >> 16) & 255;
    const tg = (bigint >> 8) & 255;
    const tb = bigint & 255;

    return { tr, tg, tb };
  }

  bgHexToRgb(hex: any) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const br = (bigint >> 16) & 255;
    const bg = (bigint >> 8) & 255;
    const bb = bigint & 255;

    return { br, bg, bb };
  }

  partyChange(event: any) {
    this.firebaseCollectionService
      .getDocuments('CompanyList', 'ChalanList')
      .then((chalan) => {
        const chalanData = chalan.filter((chalanObj: any) => chalanObj.partyId === event.value);
        const maxChalanNo =
          chalanData.length > 0
            ? Math.max(...chalanData.map((chalanObj: any) => Number(chalanObj.chalanNo) || 0)) + 1
            : Number(this.partyList.find((partyObj: any) => partyObj.id === event.value).chalanNoSeries) || 0;

        this.selectedPartyChalanNo = maxChalanNo;
      })
      .catch((error) => {
        console.error('Error fetching chalan:', error);
      });
    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      if (order && order.length > 0) {
        this.orderList = order.filter(id => id.partyId === event?.value && id.orderStatus === 'Done' && id.isCreated === false)
      }
    }).catch((error) => {
      console.error('Error fetching order:', error);
    });
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
    });
    this.updateProductsData = seletedOrderProducts;
  }

  ngAfterViewInit(): void {
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