import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { ProductDialogComponent } from '../chalan-list/product-dialog/product-dialog.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { ToWords } from 'to-words';
import { PaymentListComponent } from './payment-list/payment-list.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent {

  partyList: any = [];
  invoiceList: any = [];
  firmList: any = [];
  orderList: any = []; 
  chalanData: any = [];
  paymentReceiveData: any = [];
  invoiceListdataSource: any;
  firmDetails: any;
  orderDetails: any;
  partyDetails: any;
  selectedChalanList: any;
  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });
  invoiceListColumns: string[] = [
    'srNo',
    'no',
    'date',
    'party',
    'gross',
    'discount',
    'net',
    'CGST',
    'SGST',
    'final',
    'recived',
    'action',
  ];

  invoiceListDataSource = new MatTableDataSource(this.invoiceList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private firebaseCollectionService: FirebaseCollectionService, private dialog: MatDialog,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getInvoiceData();
    this.getPartyData();
    this.getChalanData();
    this.getOrderData();
    this.getFirmData();
    this.getPaymentReceiveList()
  }

  ngAfterViewInit(): void {
    this.invoiceListDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.invoiceListDataSource.filter = filterValue.trim().toLowerCase();
  }

  getInvoiceData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'InvoiceList').then((invoice) => {
      this.invoiceListDataSource.data = invoice;
      this.invoiceList = invoice
      if (invoice && invoice.length > 0) {
        this.invoiceListdataSource = new MatTableDataSource(this.invoiceList);
        this.invoiceListDataSource.filterPredicate = (data: any, filter: string) => {
          const srNo = (data.srNo || '').toString();
          const invoiceNo = (data.invoiceNo || '').toString();
          const date = this.getFormattedDate(data.date);
          const partyName = this.getPartyName(data.partyId);
          const gross = (data.grossTotal || '').toString();
          const discount = (data.discountRatio || '').toString();
          const netAmount = (data.netAmount || '').toString();
          const cgst = (data.cgst || '').toString();
          const sgst = (data.sgst || '').toString();
          const finalAmount = (data.finalAmount || '').toString();
          const received = this.getPaymentReceiveAmount(data);

          const dataStr = `
          ${srNo}
          ${invoiceNo}
          ${date}
          ${partyName}
          ${gross}
          ${discount}
          ${netAmount}
          ${cgst}
          ${sgst}
          ${finalAmount}
          ${received}
        `.toLowerCase();
          return dataStr.includes(filter.trim().toLowerCase());
        };
      } else {
        this.invoiceList = [];
        this.invoiceListdataSource = new MatTableDataSource(this.invoiceList);
      }
    }).catch((error) => {
      console.error('Error fetching chalan:', error);
    });
  }
  getPaymentReceiveList() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PaymentReceiveList').then((payment) => {
      this.paymentReceiveData = payment
    })
  }
  getPaymentReceiveAmount(data :any) {
    const receiveData = this.paymentReceiveData?.find((obj: any) => obj.invoiceId === data.id)?.payments.map((id: any) => id.paymentReceive).reduce((a :any , b:any) => a + b)
    return receiveData ?? 0
  }
  getFormattedDate(value:any): string {
    const milliseconds = value?.seconds * 1000;
    const date = new Date(milliseconds);
    const formattedDate = date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return formattedDate;
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

  getChalanData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'ChalanList').then((chalan) => {
      if (chalan && chalan.length > 0) {
        this.chalanData = chalan
      }
    }).catch((error) => {
      console.error('Error fetching chalan:', error);
    });
  }

  getOrderData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'OrderList').then((order) => {
      if (order && order.length > 0) {
        this.orderList = order
      }
    }).catch((error) => {
      console.error('Error fetching order:', error);
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

  getPaymentList(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(PaymentListComponent, {
      data: obj,
      width: action !== 'Delete' ? '700px' : ''
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPaymentReceiveList()
      if (result && action === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'InvoiceList');
        this.getInvoiceData()
      }
    })
  }

  generatePDF(value: any) {
    const selectedChalanPartyOrderId = this.chalanData.find((id: any) => id.id === value.chalanId).partyOrderId
    this.selectedChalanList = this.orderList.find((id: any) => id.id === selectedChalanPartyOrderId);
    this.firmDetails = this.firmList.find((id: any) => id.id === value?.firmId);
    this.partyDetails = this.partyList.find((id: any) => id.id === value?.partyId)
    
    const doc: any = new jsPDF();
    const header = (doc: any) => {
      doc.setFillColor('#fff');
      doc.rect(0, 0, doc.internal.pageSize.width, 10, 'F');
      const yPosition = 6;

      doc.setFillColor('#ffbb00');
      const rowHeight = 15;
      doc.rect(0, yPosition - rowHeight, doc.internal.pageSize.width, rowHeight, 'F');

      doc.setFontSize(10); doc.setTextColor(0, 0, 0); const verticalCenter = yPosition - rowHeight / 2 + 6;
      const phoneNumberLeft = `Mo. : ${this.firmDetails.personalMobileNo}`; const leftXPosition = 10;
      doc.text(phoneNumberLeft, leftXPosition, verticalCenter, { align: 'left' });

      const phoneNumberMiddle = "Jay Shree Ganesh"; const middleXPosition = doc.internal.pageSize.width / 2;
      doc.text(phoneNumberMiddle, middleXPosition, verticalCenter, { align: 'center' });

      const phoneNumberRight = `Mo. : ${this.firmDetails.mobileNO}`; const rightXPosition = doc.internal.pageSize.width - 10;
      doc.text(phoneNumberRight, rightXPosition, verticalCenter, { align: 'right' });

      const borderYPosition = yPosition + 1;
      const topMargin = 4;
      const bottomMargin = 4;
      const logoYPosition = borderYPosition + topMargin;

      const imgData = '../../../../assets/images/logos/side logo.png';
      const imgWidth = 50;
      const imgHeight = 7;
      const xPosition = 10;
      doc.addImage(imgData, 'PNG', xPosition, logoYPosition, imgWidth, imgHeight);

      const borderXPosition = xPosition + imgWidth + 10;
      const borderYStart = logoYPosition;
      const borderYEnd = logoYPosition + imgHeight;

      doc.setLineWidth(0.3);
      doc.line(borderXPosition, borderYStart, borderXPosition, borderYEnd);

      const address = this.firmDetails.address;
      const addressXPosition = borderXPosition + 10;
      const addressYPosition = logoYPosition + 2;

      const maxWidth = doc.internal.pageSize.width - addressXPosition - 10;
      const lineHeight = 5;
      const addressLines = doc.splitTextToSize(address, maxWidth);

      const totalLines = addressLines.length;
      const contentHeight = totalLines * lineHeight;

      const startY = addressYPosition + (contentHeight / 2) - (lineHeight / 2);
      const pageHeight = 37;
      const startYForPageCentering = (pageHeight / 2) - (contentHeight / 2);

      addressLines.forEach((line: any, index: any) => {
        const yPosition = startYForPageCentering + (index * lineHeight);
        doc.text(line, addressXPosition, yPosition);
      });
    };

    const lineTopYPosition = 23.7;
    doc.setLineWidth(0.3);
    doc.line(0, lineTopYPosition, doc.internal.pageSize.width, lineTopYPosition);

    doc.setFontSize(10);
    doc.setFillColor('#eee')
    const mobileNumberLeft = `GSTIN: ${this.firmDetails.GSTNo}`;
    const mobileNumberRight = `PAN: ${this.firmDetails.panNo}`;

    const leftXPosition = 10;
    const yPosition = 30;
    const backgroundHeight = 9;

    doc.rect(0, yPosition - 6, doc.internal.pageSize.width, backgroundHeight, 'F');
    doc.text(mobileNumberLeft, leftXPosition, yPosition, { align: 'left' });
    doc.text(mobileNumberRight, doc.internal.pageSize.width - 10, yPosition, { align: 'right' });

    const lineYPosition = yPosition + 3;

    doc.setLineWidth(0.3);
    doc.line(0, lineYPosition, doc.internal.pageSize.width, lineYPosition)

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const boxHeight = 35;
    const boxYPosition = 35;

    const box1Width = pageWidth * 0.75;
    const box1XPosition = 10;
    doc.setFillColor('#fff');
    doc.rect(box1XPosition, boxYPosition, box1Width, boxHeight, 'F');

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const fieldsLeft = ["M/s:", "Address:", "Broker:", "GSTIN:"];
    const fieldsLeftValues = [
      `${this.partyDetails.firstName + this.partyDetails.lastName}`,
      `${this.partyDetails.partyAddress}`,
      "",
      `${this.partyDetails.partyGSTIN}`
    ];

    const leftYPosition = boxYPosition + 5;
    const boxWidth = doc.internal.pageSize.width * 0.63 - box1XPosition - 10;
    const labelXPosition = box1XPosition;
    const valueXPosition = box1XPosition + 18;

    fieldsLeft.forEach((field, index) => {
      const yPosition = leftYPosition + (index * 9.5);
      doc.text(field, labelXPosition, yPosition);
      doc.text(fieldsLeftValues[index], valueXPosition, yPosition);

      const lineYPosition = yPosition + 1;
      doc.setLineWidth(0.3);
      doc.line(valueXPosition, lineYPosition, valueXPosition + boxWidth, lineYPosition);
    });


    const box2Width = pageWidth * 0.25;
    const box2XPosition = box1XPosition + box1Width + 5;
    doc.setFillColor('#fff');
    doc.rect(box2XPosition - 25, boxYPosition, box2Width, boxHeight, 'F');

    const fieldsRight = ["Invoice:", "Date:", "P.CH:", "Date:"];
    const fieldsRightValues = [value.invoiceNo, `${this.getFormattedDate(value?.date)}`, `${this.partyDetails.chalanNoSeries}`, "------------"]; // Corresponding values
    const rightYPosition = boxYPosition + 5;

    fieldsRight.forEach((field, index) => {
      const yPosition = rightYPosition + (index * 9.5);

      doc.text(field, box2XPosition - 25, yPosition);
      const textWidth = doc.getTextWidth(field);

      const valueXPosition = (box2XPosition - 28) + textWidth + 5;
      const valueYPosition = yPosition; // Position value above the line
      doc.text(fieldsRightValues[index], valueXPosition, valueYPosition);

      const lineYPosition = valueYPosition + 1;
      doc.setLineWidth(0.3);
      doc.line((box2XPosition - 25) + textWidth + 2, lineYPosition, (box2XPosition - 25) + box2Width, lineYPosition);
    });

    const columns = ["Sr.No", "Particulars", "Ch No.", "Pcs/Mtr.", "Rate", "Amount"];
    const data: any = this.selectedChalanList.products;

    data.forEach((ele: any) => { ele.total = Number(ele.productQuantity) * Number(ele.productPrice) })

    const body: any = [];
    for (let i = 0; i < 10; i++) {
      const rowData = [
        i + 1,
        data[i]?.productName,
        data[i]?.productChalanNo,
        data[i]?.productQuantity ? Number(data[i]?.productQuantity).toFixed(2) : '',
        data[i]?.productPrice ? Number(data[i]?.productPrice).toFixed(2) : '',
        data[i]?.total.toFixed(2)
      ];
      body.push(rowData);
    }

    const bankDetails = ["Date:", "Amount:"];
    const bankLeftYPosition = 204 + 5;
    const bankBoxWidth = doc.internal.pageSize.width * 0.25;
    const fontSize = 9; // Desired font size

    bankDetails.forEach((field, index) => {
      const yPosition = bankLeftYPosition + (index * 7);
      this.addTextWithFontSize(doc, field, 15, yPosition, fontSize);

      const textWidth = doc.getTextWidth(field);
      doc.setLineWidth(0.3);
      doc.line(15 + textWidth + 2, yPosition, 15 + bankBoxWidth, yPosition);
    });


    const bankDetails1 = ["Chq.No:", "Bank:"];
    const bankLeftYPosition1 = 204 + 5;
    const bankBoxWidth1 = doc.internal.pageSize.width * 0.25;
    const fontSize1 = 9;

    bankDetails1.forEach((field, index) => {
      const yPosition = bankLeftYPosition1 + (index * 7);

      this.addTextWithFontSize(doc, field, 70, yPosition, fontSize1);

      const textWidth = doc.getTextWidth(field);
      doc.setLineWidth(0.3);
      doc.line(70 + textWidth + 2, yPosition, 70 + bankBoxWidth1, yPosition);
    });

    const grossTotal = this.selectedChalanList.products.map((id: any) => id.productPrice * id.productQuantity).reduce((a: any, b: any) => { return a + b }).toFixed(2);
    const discountAmount: any = Number((grossTotal * value?.discountRatio) / 100).toFixed(2);
    const netAmount: any = Number(grossTotal - discountAmount).toFixed(2);
    const cgst = Number((netAmount * value?.cgst) / 100).toFixed(2);
    const sgst = Number((netAmount * value?.sgst) / 100).toFixed(2);
    const finalAmount = (Number(netAmount) + Number(cgst) + Number(sgst)).toFixed(2);
    const finalAmountInWords = this.toWords.convert(Number(finalAmount));

    body.push(
      ['', '', '', '', { content: 'Gross Total', styles: { halign: 'left' } }, `${grossTotal}`],
      // ['', '', '', '', { content: 'Discount 10%', styles: { halign: 'left' } }, `${discountAmount}`],
      ['', '', '', '', { content: `Discount ${value.discountRatio}%`, styles: { halign: 'left' } }, `${discountAmount}`],
      [{ content: `${finalAmountInWords}`, rowSpan: 2, colSpan: 4, styles: { halign: 'left', fontStyle: 'bold', valign: 'middle' } }, 'Net Amount', `${netAmount}`],
      [`CGST ${value?.cgst}%`, `${cgst}`],
      [{ content: '', rowSpan: 2, colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }, `SGST ${value?.sgst}%`, `${sgst}`],
      ['Final Amount', `${finalAmount}`, { styles: { FontFace: 'left' } }],
      [
        { content: `Bank Name: ${this.firmDetails.bankName}`, styles: { fontStyle: 'bold' }, colSpan: 2 },
        { content: `IFSC Code: ${this.firmDetails.ifscCode}`, styles: { fontStyle: 'bold' }, colSpan: 2 },
        { content: `Account Number: ${this.firmDetails.bankAccountNo}`, styles: { fontStyle: 'bold' }, colSpan: 2 }
      ],
    );

    const footer = (doc: any, pageNumber: any, totalPages: any) => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${pageNumber} of ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.line(10, doc.internal.pageSize.height - 15, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 15);
    };

    autoTable(doc, {
      head: [columns],
      body: body,
      startY: 80,
      theme: 'plain',
      margin: { top: 0, right: 10, bottom: 0, left: 10 },
      tableWidth: 'auto',
      headStyles: {
        fillColor: '#ffbb00',
        textColor: '#000',
        fontSize: 11,
        font: 'helvetica',
        fontStyle: 'bold',
        cellPadding: 3,
        lineWidth: 0.50
      },
      styles: {
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [0, 0, 0]
      },
      didParseCell: (data) => {
        const { row, column } = data;
        const lastRowIndex = body.length - 1;

        if (row.index >= lastRowIndex - 6 && row.index <= lastRowIndex - 2 && (column.index === 4 || column.index === 5)) {
          data.cell.styles.fontStyle = 'bold';
        }

        if (data.row.index === body.length - 2) {
          data.cell.styles.textColor = '#000';
          data.cell.styles.fillColor = '#ffbb00';
          data.cell.styles.fontStyle = 'bold';
        }

        if (data.row.index === body.length - 1) {
          data.cell.styles.textColor = '#000';
          data.cell.styles.fillColor = '#eee';
        }
      },
      didDrawPage: (data) => {
        header(doc);
        const pageNumber = doc.internal.getNumberOfPages();
        footer(doc, pageNumber, pageNumber);
      },
    });

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const termsText =
      "1. Payment only by payee's A/c. cheque or cash is required.\n" +
      "2. The payment must be made on demand.\n" +
      "3. Goods once sold will not be taken back.\n" +
      "4. Our responsibility ceases sooner on goods leaves on your premises.\n" +
      "5. Subject to SURAT jurisdiction.";

    const termsYPosition = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions:", 10, termsYPosition);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lineHeight = 6;

    const termsLines = termsText.split('\n');
    termsLines.forEach((line, index) => {
      doc.text(line, 10, termsYPosition + 7 + (index * lineHeight));
    });

    const signatureYPosition = doc.internal.pageSize.height - 35;
    const signatureXPosition = doc.internal.pageSize.width - 60;
    const signatureLineLength = 50;
    const signatureLabelYPosition = signatureYPosition + 10;

    doc.setFontSize(11);
    doc.setTextColor('#ddd');
    doc.text("Signature", signatureXPosition + 17, signatureLabelYPosition);

    doc.setLineWidth(0.2);
    doc.line(signatureXPosition, signatureLabelYPosition + 5, signatureXPosition + signatureLineLength, signatureLabelYPosition + 5);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  addTextWithFontSize(doc: any, text: any, x: any, y: any, fontSize: any) {
    const originalFontSize = doc.internal.getFontSize();
    doc.setFontSize(fontSize);
    doc.text(text, x, y);
    doc.setFontSize(originalFontSize);
  }


  getPartyName(partyId: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyId)?.firstName
  }
}
