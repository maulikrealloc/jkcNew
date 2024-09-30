import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCollectionService {

  constructor(private firestore: AngularFirestore, private snackBar: MatSnackBar,
    private spinnerService: SpinnerService) { }

  async addFirmToCompany(firmData: any) {
    this.spinnerService.setSpinner(true)
    const companyId: any = localStorage.getItem('uid')
    try {
      await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').add({
        header: firmData.header,
        subHeader: firmData.subHeader,
        address: firmData.address,
        GSTNo: firmData.GSTNo,
        gstPercentage: firmData.gstPercentage,
        panNo: firmData.panNo,
        mobileNO: firmData.mobileNO,
        personalMobileNo: firmData.personalMobileNo,
        email: firmData.email,
        bankName: firmData.bankName,
        ifscCode: firmData.ifscCode,
        bankAccountNo: firmData.bankAccountNo
      });
      this.snackBar.open('record added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.spinnerService.setSpinner(false)

    } catch (error: any) {
      this.snackBar.open(`Error adding firm: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.spinnerService.setSpinner(false)
      throw error;
    }
  }

  async updateFirmInCompany(firmId: string, firmData: any) {
    this.spinnerService.setSpinner(true)
    const companyId: any = localStorage.getItem('uid');
    try {
      await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').doc(firmId).update({
        header: firmData.header,
        subHeader: firmData.subHeader,
        address: firmData.address,
        GSTNo: firmData.GSTNo,
        gstPercentage: firmData.gstPercentage,
        panNo: firmData.panNo,
        mobileNO: firmData.mobileNO,
        personalMobileNo: firmData.personalMobileNo,
        email: firmData.email,
        bankName: firmData.bankName,
        ifscCode: firmData.ifscCode,
        bankAccountNo: firmData.bankAccountNo
      });
      this.snackBar.open('Firm record updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.spinnerService.setSpinner(false)
    } catch (error: any) {
      this.snackBar.open(`Error updating firm: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.spinnerService.setSpinner(false)
      throw error;
    }
  }

  async deleteFirmInCompany(firmId: string) {
    this.spinnerService.setSpinner(true)
    const companyId: any = localStorage.getItem('uid');
    try {
      await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').doc(firmId).delete();
      this.snackBar.open('Firm record deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.spinnerService.setSpinner(false)
    } catch (error: any) {
      this.snackBar.open(`Error deleting firm: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.spinnerService.setSpinner(false)
      throw error;
    }
  }

  async getFirmsFromCompany() {
    this.spinnerService.setSpinner(true)
    const companyId: any = localStorage.getItem('uid');
    try {
      const snapshot = await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').get().toPromise();

      const firms: any[] = [];
      snapshot?.forEach((doc: any) => {
        firms.push({
          id: doc.id,
          ...doc.data()
        });
      });
      this.spinnerService.setSpinner(false)
      return firms;
    } catch (error: any) {
      this.snackBar.open(`Error fetching firms: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.spinnerService.setSpinner(false)
      throw error;
    }
  }


}
