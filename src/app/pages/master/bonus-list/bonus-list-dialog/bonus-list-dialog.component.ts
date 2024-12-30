import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { designMasterDialogComponent } from '../../design-master/design-master.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-bonus-list-dialog',
  templateUrl: './bonus-list-dialog.component.html',
  styleUrls: ['./bonus-list-dialog.component.scss']
})
export class BonusListDialogComponent implements OnInit {

  bonusForm: FormGroup;
  local_data: any;
  action: string;
  employeesList: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BonusListDialogComponent>,
    private firebaseCollectionService: FirebaseCollectionService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.bonusForm.controls['employeeList'].setValue(this.local_data.employeeList)
      this.bonusForm.controls['amount'].setValue(this.local_data.amount)
      this.bonusForm.controls['date'].setValue(this.convertTimestampToDate(this.local_data.date))
    }
    this.getEmployeeData();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }
  
  buildForm() {
    this.bonusForm = this.fb.group({
      employeeList: ['',Validators.required],
      amount: ['',Validators.required],
      date: new Date(),
    })
  }

  doAction() {
    const payload = {
      employeeList: this.bonusForm.value.employeeList,
      amount: this.bonusForm.value.amount,
      date: this.bonusForm.value.date
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  getEmployeeData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'EmployeeList').then((employee) => {
      if (employee && employee.length > 0) {
        this.employeesList = employee
      }
    }).catch((error) => {
      console.error('Error fetching employee:', error);
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}