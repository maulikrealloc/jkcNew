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

  // async addFirmToCompany(firmData: any) {
  //   this.spinnerService.setSpinner(true)
  //   const companyId: any = localStorage.getItem('uid')
  //   try {
  //     await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').add({
  //       header: firmData.header,
  //       subHeader: firmData.subHeader,
  //       address: firmData.address,
  //       GSTNo: firmData.GSTNo,
  //       gstPercentage: firmData.gstPercentage,
  //       panNo: firmData.panNo,
  //       mobileNO: firmData.mobileNO,
  //       personalMobileNo: firmData.personalMobileNo,
  //       email: firmData.email,
  //       bankName: firmData.bankName,
  //       ifscCode: firmData.ifscCode,
  //       bankAccountNo: firmData.bankAccountNo
  //     });
  //     this.snackBar.open('record added successfully', 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     this.spinnerService.setSpinner(false)

  //   } catch (error: any) {
  //     this.snackBar.open(`Error adding firm: ${error.message}`, 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     this.spinnerService.setSpinner(false)
  //     throw error;
  //   }
  // }

  // async updateFirmInCompany(firmId: string, firmData: any) {
  //   this.spinnerService.setSpinner(true)
  //   const companyId: any = localStorage.getItem('uid');
  //   try {
  //     await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').doc(firmId).update({
  //       header: firmData.header,
  //       subHeader: firmData.subHeader,
  //       address: firmData.address,
  //       GSTNo: firmData.GSTNo,
  //       gstPercentage: firmData.gstPercentage,
  //       panNo: firmData.panNo,
  //       mobileNO: firmData.mobileNO,
  //       personalMobileNo: firmData.personalMobileNo,
  //       email: firmData.email,
  //       bankName: firmData.bankName,
  //       ifscCode: firmData.ifscCode,
  //       bankAccountNo: firmData.bankAccountNo
  //     });
  //     this.snackBar.open('Firm record updated successfully', 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     this.spinnerService.setSpinner(false)
  //   } catch (error: any) {
  //     this.snackBar.open(`Error updating firm: ${error.message}`, 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     this.spinnerService.setSpinner(false)
  //     throw error;
  //   }
  // }

  // async deleteFirmInCompany(firmId: string) {
  //   this.spinnerService.setSpinner(true)
  //   const companyId: any = localStorage.getItem('uid');
  //   try {
  //     await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').doc(firmId).delete();
  //     this.snackBar.open('Firm record deleted successfully', 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     this.spinnerService.setSpinner(false)
  //   } catch (error: any) {
  //     this.snackBar.open(`Error deleting firm: ${error.message}`, 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     this.spinnerService.setSpinner(false)
  //     throw error;
  //   }
  // }

  // async getFirmsFromCompany() {
  //   this.spinnerService.setSpinner(true)
  //   const companyId: any = localStorage.getItem('uid');
  //   try {
  //     const snapshot = await this.firestore.collection('CompanyList').doc(companyId).collection('FirmList').get().toPromise();

  //     const firms: any[] = [];
  //     snapshot?.forEach((doc: any) => {
  //       firms.push({
  //         id: doc.id,
  //         ...doc.data()
  //       });
  //     });
  //     this.spinnerService.setSpinner(false)
  //     return firms;
  //   } catch (error: any) {
  //     this.snackBar.open(`Error fetching firms: ${error.message}`, 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     this.spinnerService.setSpinner(false)
  //     throw error;
  //   }
  // }


  // Generic method to add a document to any collection
  async addDocument(collectionName: string, documentData: any, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef:any = this.firestore.collection(collectionName).doc(companyId);
      
      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName);
      }

      await collectionRef.add(documentData);
      this.snackBar.open('Document added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error adding document: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // Generic method to update a document in any collection
  async updateDocument(collectionName: string, documentId: string, documentData: any, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef = this.firestore.collection(collectionName).doc(companyId);
      
      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName).doc(documentId);
      } else {
        collectionRef = collectionRef.collection(collectionName).doc(documentId);
      }

      await collectionRef.update(documentData);
      this.snackBar.open('Document updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error updating document: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // Generic method to delete a document from any collection
  async deleteDocument(collectionName: string, documentId: string, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef = this.firestore.collection(collectionName).doc(companyId);

      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName).doc(documentId);
      } else {
        collectionRef = collectionRef.collection(collectionName).doc(documentId);
      }

      await collectionRef.delete();
      this.snackBar.open('Document deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error deleting document: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // Generic method to get all documents from any collection
  async getDocuments(collectionName: string, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef:any = this.firestore.collection(collectionName).doc(companyId);
      
      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName);
      }

      const snapshot = await collectionRef.get().toPromise();
      const documents: any[] = [];

      snapshot?.forEach((doc: any) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error: any) {
      this.snackBar.open(`Error fetching documents: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

}
