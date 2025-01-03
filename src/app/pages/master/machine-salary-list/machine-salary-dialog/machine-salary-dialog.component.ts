import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BonusListDialogComponent } from '../../bonus-list/bonus-list-dialog/bonus-list-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-machine-salary-dialog',
  templateUrl: './machine-salary-dialog.component.html',
  styleUrls: ['./machine-salary-dialog.component.scss']
})

export class MachineSalaryDialogComponent implements OnInit {

  machineSalaryForm: FormGroup;
  local_data: any;
  action: string;
  employeesList: any = [];

  constructor(
    private fb: FormBuilder, public dialogRef: MatDialogRef<MachineSalaryDialogComponent>,
    private firebaseCollectionService: FirebaseCollectionService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.machineSalaryForm.controls['employeeList'].setValue(this.local_data.employeeList)
      this.machineSalaryForm.controls['amount'].setValue(this.local_data.amount)
      this.machineSalaryForm.controls['date'].setValue(this.convertTimestampToDate(this.local_data.date))
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
    this.machineSalaryForm = this.fb.group({
      employeeList: ['', Validators.required],
      amount: ['', Validators.required],
      date: new Date(),
    })
  }

  doAction() {
    const payload = {
      employeeList: this.machineSalaryForm.value.employeeList,
      amount: this.machineSalaryForm.value.amount,
      date: this.machineSalaryForm.value.date
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