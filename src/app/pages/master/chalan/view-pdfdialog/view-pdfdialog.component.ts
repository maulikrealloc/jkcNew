import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-view-pdfdialog',
  templateUrl: './view-pdfdialog.component.html',
  styleUrls: ['./view-pdfdialog.component.scss']
})
export class ViewPDFdialogComponent implements OnInit {
  local_data: any;
  pdfSrc: any;
  chalanList: any[] = [];
  isDisplayChalan: boolean = false;
  updateProductsData: any = {};

  constructor(
    public dialogRef: MatDialogRef<ViewPDFdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
    this.pdfSrc = this.data.payload.url;
    console.log("{this.data.payload}", this.data.payload);
    console.log("{this.pdfSrc}", this.pdfSrc);
  }

  convertTimestampToDate(timestamp: any): string {
    if (!timestamp) return '';
    let date: Date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }
    return date.toISOString().split('T')[0];
  }

  close() {
    this.dialogRef.close();
  }

  getSubTotal(): number {
    return this.data?.payload?.chalanForm?.product?.reduce(
      (sum: any, item: any) => sum + (item.totalAmount || 0),
      0
    ) || 0;
  }

  convertNumberToWords(amount: number): string {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    function convertToWords(num: number): string {
      if (num === 0) return 'Zero';
      let word = '';
      let place = 0;
      while (num > 0) {
        if (num % 1000 !== 0) {
          word = helper(num % 1000) + ' ' + thousands[place] + ' ' + word;
        }
        num = Math.floor(num / 1000);
        place++;
      }
      return word.trim();
    }

    function helper(num: number): string {
      if (num === 0) return '';
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) return tens[Math.floor(num / 10)] + ' ' + helper(num % 10);
      return units[Math.floor(num / 100)] + ' Hundred ' + helper(num % 100);
    }

    let [integerPart, decimalPart] = amount.toFixed(2).split('.');
    let words = convertToWords(parseInt(integerPart)) + ' Rupees';
    if (parseInt(decimalPart) > 0) {
      words += ' and ' + convertToWords(parseInt(decimalPart)) + ' Paise';
    }
    return words;
  }

  submitData() {
    this.isDisplayChalan = true;
    const payload = {
      firmId: this.data?.payload?.chalanForm.firm,
      partyId: this.data?.payload?.chalanForm.party,
      partyOrderId: this.data?.payload?.chalanForm.partyOrder,
      chalanDate: this.data?.payload?.chalanForm.date,
      chalanNo: this.data?.payload?.selectedPartyChalanNo,
      netAmount: this.data.payload.chalanForm.product.map((id: any) => id.totalAmount).reduce((a: any, b: any) => a + b),
      isCreated: false,
    }
    this.data.payload.updateProductsData.isCreated = true;
    this.firebaseCollectionService.updateDocument('CompanyList', this.data.payload.updateProductsData.id, this.data.payload.updateProductsData, 'OrderList');
    this.firebaseCollectionService.addDocument('CompanyList', payload, 'ChalanList');
  }

}
