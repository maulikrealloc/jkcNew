import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { ToWords } from 'to-words';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-chalan-list',
  templateUrl: './chalan-list.component.html',
  styleUrls: ['./chalan-list.component.scss']
})

export class ChalanListComponent implements OnInit {

  chalanDataColumns: string[] = [ 'srNo', 'partyName', 'partyOrder', 'chalanNo', 'chalanDate', 'netAmount', 'action'];
  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  firmList: any = [];
  partyList: any = [];
  orderList: any = [];
  chalanList: any = [];
  partyDetails: any;
  firmDetails: any;
  selectedOrderData: any;
  netAmount: number = 0;
  chalanListDataSource = new MatTableDataSource(this.chalanList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getFirmData();
    this.getPartyData();
    this.getChalanData();
    this.getOrderData();
    this.chalanListDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.chalanListDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getPartyName(partyId: string): string {
    return this.partyList.find((partyObj: any) => partyObj.id === partyId)?.firstName;
  }

  getOrderNo(partyOrderId: string): string {
    return this.orderList.find((orderObj: any) => orderObj.id === partyOrderId)?.partyOrder;
  }

  getChalanData() {
    this.commonService.fetchData('ChalanList', this.chalanList, this.chalanListDataSource).then((chalan) => {
      if (this.chalanList.length > 0) this.filterData();
          this.chalanListDataSource.paginator = this.paginator;
    })
  }

  filterData() {
    this.chalanListDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        data.srNo || '',
        this.getPartyName(data.partyId),
        this.getOrderNo(data.partyOrderId),
        data.chalanNo || '',
        this.convertTimestampToDate(data.chalanDate),
        data.netAmount || ''
      ].join(' ').toLowerCase();
      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  getFirmData() {
    this.commonService.fetchData('FirmList', this.firmList);
  }

  getOrderData() {
    this.commonService.fetchData('OrderList', this.orderList);
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList);
  }

  partyChange(event: any) {
    const partyChange = this.chalanList.filter((chalanObj: any) => chalanObj.partyId === event.value)
    this.chalanListDataSource = new MatTableDataSource(partyChange);
  }

  deleteChalan(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'ChalanList').then(() => this.getChalanData()).catch(console.error);
      }
    });
  }

  getProductList(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: obj,
      width: '700px'
    });
  }

  downloadPDF(data: any) {
    this.getPartyDetails(data.partyId);
    this.getFirmDetails(data.firmId);
    this.selectedOrderData = this.orderList.find((obj: any) => obj.id === data.partyOrderId);
    this.generatePDF(data);
  }

  getPartyDetails(partyId: any) {
    this.partyDetails = this.partyList.find((id: any) => id.id === partyId);
  }

  getFirmDetails(firmId: any) {
    this.firmDetails = this.firmList.find((id: any) => id.id === firmId);
  }

  generatePDF(seletedChalan: any) {
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
      doc.text(`Chalan No: ${seletedChalan.chalanNo}`, rightColumnX + 5, startChalanY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const jsDate = new Date(seletedChalan.chalanDate.seconds * 1000);
      const formattedDate = moment(jsDate).format('DD/MM/YYYY');
      doc.text(`Date: ${formattedDate}`, rightColumnX + 5, startChalanY + chalanSpacing);
      doc.text(`PO No: ${this.selectedOrderData.partyOrder}`, rightColumnX + 5, startChalanY + chalanSpacing * 2);
      doc.setFontSize(11);

      const products = this.selectedOrderData.products;

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
        ...products.map((p: any, index: number) => {
          const totalAmount = p.productPrice * p.productQuantity;
          return [
            (index + 1).toString(),
            p.productName,
            p.productQuantity.toString(),
            p.productPrice.toString(),
            totalAmount.toString()
          ];
        }),
        ...emptyRows
      ];

      this.netAmount = seletedChalan.netAmount;

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
      const imgData: any = '';

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
      doc.text(`Chalan No: ${seletedChalan.chalanNo}`, rightColumnX + 5, startChalanY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const jsDate = new Date(seletedChalan.chalanDate.seconds * 1000);
      const formattedDate = moment(jsDate).format('DD/MM/YYYY');
      doc.text(`Date: ${formattedDate}`, rightColumnX + 5, startChalanY + chalanSpacing);
      doc.text(`PO No: ${this.selectedOrderData.partyOrder}`, rightColumnX + 5, startChalanY + chalanSpacing * 2);
      doc.setFontSize(11);

      const products = this.selectedOrderData.products;

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
        ...products.map((p: any, index: number) => {
          const totalAmount = p.productPrice * p.productQuantity;
          return [
            (index + 1).toString(),
            p.productName,
            p.productQuantity.toString(),
            p.productPrice.toString(),
            totalAmount.toString()
          ];
        }),
        ...emptyRows
      ];

      const netAmount = seletedChalan.netAmount;

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
      const imgData: any = '';

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
    const newTab = window.open(url);
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

}