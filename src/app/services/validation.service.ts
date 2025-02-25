import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  getValidationMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return ''; // Don't show error if untouched
    }

    const firstErrorKey = Object.keys(control.errors)[0];
    const errorValue = control.errors[firstErrorKey];

    const validationMessages: { [key: string]: string } = {
      required: 'This field is required',
      email: 'Invalid email format',
      pattern: 'Invalid format',
    };

    switch (firstErrorKey) {
      case 'minlength':
        return `Minimum length required is ${errorValue.requiredLength}`;
      case 'maxlength':
        return `Maximum length allowed is ${errorValue.requiredLength}`;
      case 'min':
        return `Minimum value should be ${errorValue.min}`;
      case 'max':
        return `Maximum value should be ${errorValue.max}`;
      default:
        return validationMessages[firstErrorKey] || 'Invalid input';
    }
  }

  generatePDF(partyDetails: any, firmDetails: any, chalanForm: any, partyOrder: any, imageUrl: any, netAmount: any, toWords: any): void {
    const { tr, tg, tb } = this.textHexToRgb(partyDetails.partyColorCode.fontColor);
    const { br, bg, bb } = this.bgHexToRgb(partyDetails.partyColorCode.bgColor);
    const doc = new jsPDF();

    const addContent = () => {

      const margin = 5;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

      doc.setFontSize(10);
      doc.text(`MO: ${firmDetails?.mobileNO.toString()}`, margin + 8, margin + 8);
      if (firmDetails?.personalMobileNo) {
        doc.text(`MO: ${firmDetails?.personalMobileNo.toString()}`, pageWidth - margin - 35, margin + 8);
      }

      doc.setTextColor(br, bg, bb);
      doc.setFont('helvetica', 'bold');
      const title = firmDetails.header;
      doc.setFontSize(22);
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, margin + 20);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      const address = firmDetails.address;
      const addressY = margin + 38;
      doc.setFontSize(10);

      const addressLines = doc.splitTextToSize(address, pageWidth - 2 * margin);

      addressLines.forEach((line: any, index: number) => {
        const addressX = (pageWidth - doc.getTextWidth(line)) / 2;
        doc.text(line, addressX, addressY + (index * 5));
      });

      const details = firmDetails.subHeader;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      const detailsWidth = doc.getTextWidth(details);
      const detailsX = (pageWidth - detailsWidth) / 2;
      doc.text(details, detailsX, addressY - 24 + addressLines.length * 5 + 10);

      const leftColumnX = margin + 5;
      const rightColumnX = pageWidth - margin - 55;
      const startY = addressY + addressLines.length * 5 + 12;

      const partyaddress = `Address: ${partyDetails.partyAddress}`;
      doc.setFontSize(11);

      const partyaddressLines = doc.splitTextToSize(partyaddress, 100 - 2 * margin);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(br, bg, bb);
      doc.text(`To: ${partyDetails?.firstName + partyDetails.lastName}`, leftColumnX + 4, startY);
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
      doc.text(`Chalan No: ${chalanForm.value.product[0].chalanNo}`, rightColumnX + 5, startChalanY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const formattedDate = moment(chalanForm.value.date).format('DD/MM/YYYY');
      doc.text(`Date: ${formattedDate}`, rightColumnX + 5, startChalanY + chalanSpacing);
      doc.text(`PO No: ${partyOrder}`, rightColumnX + 5, startChalanY + chalanSpacing * 2);
      doc.setFontSize(11);

      const products = chalanForm.value.product;

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

      netAmount = products.reduce((sum: any, p: any) => sum + p.totalAmount, 0);

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
          [firmDetails.GSTNo, toWords.convert(netAmount)],
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
      const imgData: any = imageUrl;
      if (imageUrl) {
        doc.addImage(imgData, 'PNG', margin + 8, signatureY, imgWidth, imgHeight);
      }
      doc.text('Signature', pageWidth - margin - 50, signatureY + 20 + imgHeight / 2);

      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      const footerY = doc.internal.pageSize.getHeight() - 12;
      const footerText = `Thank you for your business "${partyDetails?.firstName + partyDetails.lastName}"`;
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
      doc.text(`MO: ${firmDetails?.mobileNO.toString()}`, margin + 8, margin + 8);
      if (firmDetails?.personalMobileNo) {
        doc.text(`MO: ${firmDetails?.personalMobileNo.toString()}`, pageWidth - margin - 35, margin + 8);
      }

      doc.setTextColor(2, 2, 2);
      doc.setFont('helvetica', 'bold');
      const title = firmDetails.header;
      doc.setFontSize(22);
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, margin + 20);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      const address = firmDetails.address;
      const addressY = margin + 38;
      doc.setFontSize(10);

      const addressLines = doc.splitTextToSize(address, pageWidth - 2 * margin);

      addressLines.forEach((line: any, index: number) => {
        const addressX = (pageWidth - doc.getTextWidth(line)) / 2;
        doc.text(line, addressX, addressY + (index * 5));
      });

      const details = firmDetails.subHeader;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      const detailsWidth = doc.getTextWidth(details);
      const detailsX = (pageWidth - detailsWidth) / 2;
      doc.text(details, detailsX, addressY - 24 + addressLines.length * 5 + 10);

      const leftColumnX = margin + 5;
      const rightColumnX = pageWidth - margin - 55;
      const startY = addressY + addressLines.length * 5 + 12;

      const partyaddress = `Address: ${partyDetails.partyAddress}`;
      doc.setFontSize(11);

      const partyaddressLines = doc.splitTextToSize(partyaddress, 100 - 2 * margin);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(2, 2, 2);
      doc.text(`To: ${partyDetails?.firstName + partyDetails.lastName}`, leftColumnX + 4, startY);
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
      doc.text(`Chalan No: ${chalanForm.value.product[0].chalanNo}`, rightColumnX + 5, startChalanY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const formattedDate = moment(chalanForm.value.date).format('DD/MM/YYYY');
      doc.text(`Date: ${formattedDate}`, rightColumnX + 5, startChalanY + chalanSpacing);
      doc.text(`PO No: ${partyOrder}`, rightColumnX + 5, startChalanY + chalanSpacing * 2);
      doc.setFontSize(11);

      const products = chalanForm.value.product;

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
          [firmDetails.GSTNo, toWords.convert(netAmount)],
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
      const imgData: any = imageUrl;
      if (imageUrl) {
        doc.addImage(imgData, 'PNG', margin + 8, signatureY, imgWidth, imgHeight);
      }
      doc.text('Signature', pageWidth - margin - 50, signatureY + 20 + imgHeight / 2);

      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      const footerY = doc.internal.pageSize.getHeight() - 12;
      const footerText = `Thank you for your business "${partyDetails?.firstName + partyDetails.lastName}"`;
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
