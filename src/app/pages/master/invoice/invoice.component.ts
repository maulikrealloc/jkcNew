import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToWords } from 'to-words';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

export class InvoiceComponent implements OnInit {

  invoiceDataColumns: string[] = [
    'srNo',
    'productName',
    'productPrice',
    'quantity',
    'chalanNo',
    'totalAmount',
    'finalAmount',
    'action',
  ];
  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  invoiceForm: FormGroup;
  firmList: any = [];
  partyList: any = [];
  chalanList: any = [];
  InvoiceList: any = [];
  chalanData: any = [];
  orderList: any = [];
  partyDetails: any;
  firmDetails: any;
  orderDetails: any;
  selectedChalanList: any = [];
  invoiceListDataSource = new MatTableDataSource(this.selectedChalanList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder,
    private firebaseCollectionService: FirebaseCollectionService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.buildForm();
    this.getFirmData();
    this.getPartyData();
    this.getChalanData();
    this.getOrderData();
    this.getInvoiceData();
    this.invoiceListDataSource.paginator = this.paginator;
  }

  buildForm() {
    this.invoiceForm = this.fb.group({
      firm: ['', Validators.required],
      party: ['', Validators.required],
      chalanNo: ['', Validators.required],
      date: new Date(),
      invoiceNo: [''],
      cgst: [0],
      sgst: [0],
      discountRatio: [0]
    })
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
        this.chalanData = chalan.filter((id: any) => id.isCreated === false)
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

  firmChange(event: any) {
    this.chalanList = this.chalanData.filter((obj: any) => obj.firmId === event.value)
    this.firebaseCollectionService
      .getDocuments('CompanyList', 'InvoiceList')
      .then((invoice) => {
        const invoiceData = invoice.filter(
          (invoiceObj: any) => invoiceObj.firmId === event.value
        );
        const maxInvoiceNo: any =
          invoiceData.length > 0
            ? (Math.max(...invoiceData.map((invoiceObj: any) => Number(invoiceObj.invoiceNo) || 0)) + 1).toString().padStart(4, '0')
            : '0001';
        this.invoiceForm.controls['invoiceNo'].setValue(maxInvoiceNo);
      })
      .catch((error) => {
        console.error('Error fetching invoice:', error);
      });
  }

  partyChange(event: any) {
    this.chalanList = this.chalanData.filter((id: any) => id.partyId === event.value)
  }

  chalanChange(event: any) {
    const selectedChalanPartyOrderId = this.chalanList.find((id: any) => id.id === event.value).partyOrderId
    this.selectedChalanList = this.orderList.find((id: any) => id.id === selectedChalanPartyOrderId)
  }

  invoiceSubmitData() {
    const grossTotal = this.selectedChalanList.products.map((id: any) => id.productQuantity * id.productPrice).reduce((a: any, b: any) => { return a + b }).toFixed(2);
    const discountAmount: any = Number((grossTotal * this.invoiceForm.value.discountRatio) / 100).toFixed(2);
    const netAmount: any = Number(grossTotal - discountAmount).toFixed(2);
    const cgst = Number((netAmount * Number(this.invoiceForm.value.cgst)) / 100).toFixed(2);
    const sgst = Number((netAmount * Number(this.invoiceForm.value.sgst)) / 100).toFixed(2);
    const finalAmount = (Number(netAmount) + Number(cgst) + Number(sgst)).toFixed(2);

    const payload = {
      firmId: this.invoiceForm.value.firm,
      partyId: this.invoiceForm.value.party,
      chalanId: this.invoiceForm.value.chalanNo,
      date: this.invoiceForm.value.date,
      invoiceNo: this.invoiceForm.value.invoiceNo,
      cgst: Number(this.invoiceForm.value.cgst),
      sgst: Number(this.invoiceForm.value.sgst),
      discountRatio: this.invoiceForm.value.discountRatio,
      grossTotal: grossTotal,
      netAmount: netAmount,
      finalAmount: finalAmount
    }

    this.updateChalanIsCreated(payload.chalanId)
    this.firebaseCollectionService.addDocument('CompanyList', payload, 'InvoiceList');
    this.invoiceForm.reset({
      firm: '',
      party: '',
      chalanNo: '',
      date: new Date(),
      invoiceNo: null,
      discountRatio: 0,
      cgst: 0,
      sgst: 0
    });
    this.invoiceForm.controls['firm'].setErrors(null)
    this.invoiceForm.controls['party'].setErrors(null)
    this.invoiceForm.controls['chalanNo'].setErrors(null)
    this.invoiceForm.controls['date'].setErrors(null)
    this.invoiceForm.controls['invoiceNo'].setErrors(null)
    this.invoiceForm.controls['cgst'].setErrors(null)
    this.invoiceForm.controls['sgst'].setErrors(null)
    this.invoiceForm.controls['discountRatio'].setErrors(null)
    this.selectedChalanList = [];
    this.invoiceListDataSource = new MatTableDataSource(this.selectedChalanList);
  }

  invoiceView() {
    const grossTotal = this.selectedChalanList.products?.map((id: any) => id.productQuantity * id.productPrice).reduce((a: any, b: any) => { return a + b }).toFixed(2);
    const discountAmount: any = Number((grossTotal * this.invoiceForm.value.discountRatio) / 100).toFixed(2);
    const netAmount: any = Number(grossTotal - discountAmount).toFixed(2);
    const cgst = Number((netAmount * Number(this.invoiceForm.value.cgst)) / 100).toFixed(2);
    const sgst = Number((netAmount * Number(this.invoiceForm.value.sgst)) / 100).toFixed(2);
    const finalAmount = (Number(netAmount) + Number(cgst) + Number(sgst)).toFixed(2);

    const payload = {
      firmId: this.invoiceForm.value.firm,
      partyId: this.invoiceForm.value.party,
      chalanId: this.invoiceForm.value.chalanNo,
      date: this.invoiceForm.value.date,
      invoiceNo: this.invoiceForm.value.invoiceNo,
      cgst: Number(this.invoiceForm.value.cgst),
      sgst: Number(this.invoiceForm.value.sgst),
      discountRatio: this.invoiceForm.value.discountRatio,
      grossTotal: grossTotal,
      netAmount: netAmount,
      finalAmount: finalAmount
    }
    this.getPartyDetails(payload.partyId);
    this.getFirmDetails(payload.firmId);
    this.getChalanDetails(payload.chalanId);
    this.generatePDF(payload);
    // this.invoiceForm.markAsPristine();
    // this.invoiceForm.markAsUntouched();
    // this.selectedChalanList = [];
    // this.invoiceListDataSource = new MatTableDataSource(this.selectedChalanList);

  }

  updateChalanIsCreated(chalanId: any) {
    const findChalanData = this.chalanList.find((id: any) => id.id === chalanId)
    findChalanData.isCreated = true
    this.firebaseCollectionService.updateDocument('CompanyList', findChalanData.id, findChalanData, 'ChalanList');
  }

  getInvoiceData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'InvoiceList').then((invoice) => {
      this.InvoiceList = invoice
    }).catch((error) => {
      console.error('Error fetching invoice:', error);
    });
  }

  calculateFinalAmount(baseAmount: number): number {
    const discountRatio = this.invoiceForm.value.discountRatio || 0;
    const discount = (baseAmount * discountRatio) / 100;
    const netAmount = baseAmount - discount

    const sgst = this.invoiceForm.value.sgst || 0;
    const cgst = this.invoiceForm.value.cgst || 0;

    const sgstAmount = (netAmount * sgst) / 100;
    const cgstAmount = (netAmount * cgst) / 100;

    const finalAmount = netAmount + sgstAmount + cgstAmount;
    return finalAmount;
  }

  deleteInvoiceData(index: number) {
    this.selectedChalanList?.products.splice(index, 1);
  }

  generatePDF(invoiceData: any) {
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
    const fieldsRightValues = [invoiceData.invoiceNo, `${this.datePipe.transform(invoiceData?.date, 'dd-MM-yyyy')}`, `${this.partyDetails.chalanNoSeries}`, "------------"];
    const rightYPosition = boxYPosition + 5;

    fieldsRight.forEach((field, index) => {
      const yPosition = rightYPosition + (index * 9.5);

      doc.text(field, box2XPosition - 25, yPosition);
      const textWidth = doc.getTextWidth(field);

      const valueXPosition = (box2XPosition - 28) + textWidth + 5;
      const valueYPosition = yPosition;
      doc.text(fieldsRightValues[index], valueXPosition, valueYPosition);

      const lineYPosition = valueYPosition + 1;
      doc.setLineWidth(0.3);
      doc.line((box2XPosition - 25) + textWidth + 2, lineYPosition, (box2XPosition - 25) + box2Width, lineYPosition);
    });

    const columns = ["Sr.No", "Particulars", "Ch No.", "Pcs/Mtr.", "Rate", "Amount"];
    const data: any = this.orderDetails.products;

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
    const fontSize = 9;

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

    const grossTotal = data.map((id: any) => id.total).reduce((a: any, b: any) => { return a + b }).toFixed(2);
    const discountAmount: any = Number((grossTotal * invoiceData?.discountRatio) / 100).toFixed(2);
    const netAmount: any = Number(grossTotal - discountAmount).toFixed(2);
    const cgst = Number((netAmount * invoiceData?.cgst) / 100).toFixed(2);
    const sgst = Number((netAmount * invoiceData?.sgst) / 100).toFixed(2);
    const finalAmount = (Number(netAmount) + Number(cgst) + Number(sgst)).toFixed(2);
    const finalAmountInWords = this.toWords.convert(Number(finalAmount));

    body.push(
      ['', '', '', '', { content: 'Gross Total', styles: { halign: 'left' } }, `${grossTotal}`],
      ['', '', '', '', { content: `Discount ${invoiceData.discountRatio}%`, styles: { halign: 'left' } }, `${discountAmount}`],
      [{ content: `${finalAmountInWords}`, rowSpan: 2, colSpan: 4, styles: { halign: 'left', fontStyle: 'bold', valign: 'middle' } }, 'Net Amount', `${netAmount}`],
      [`CGST ${invoiceData?.cgst}%`, `${cgst}`],
      [{ content: '', rowSpan: 2, colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }, `SGST ${invoiceData?.sgst}%`, `${sgst}`],
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

  getPartyDetails(partyId: any) {
    this.partyDetails = this.partyList.find((id: any) => id.id === partyId)
  }

  getFirmDetails(firmId: any) {
    this.firmDetails = this.firmList.find((id: any) => id.id === firmId)
  }

  getChalanDetails(chalanId: any) {
    this.orderDetails = this.orderList.find((id: any) => id.id === this.chalanList.find((id: any) => id.id === chalanId).partyOrderId)
  }

  addTextWithFontSize(doc: any, text: any, x: any, y: any, fontSize: any) {
    const originalFontSize = doc.internal.getFontSize();
    doc.setFontSize(fontSize);
    doc.text(text, x, y);
    doc.setFontSize(originalFontSize);
  }

}