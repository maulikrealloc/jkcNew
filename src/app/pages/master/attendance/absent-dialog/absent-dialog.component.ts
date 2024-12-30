import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-absent-dialog',
  templateUrl: './absent-dialog.component.html',
  styleUrls: ['./absent-dialog.component.scss']
})
export class AbsentDialogComponent implements OnInit {

  absentForm: FormGroup;
  local_data: any;
  action: string;
  employeesList: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AbsentDialogComponent>,
    private firebaseCollectionService: FirebaseCollectionService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.absentForm.controls['employeeList'].setValue(this.local_data.employeeList)
      this.absentForm.controls['day'].setValue(this.local_data.day)
      this.absentForm.controls['date'].setValue(this.convertTimestampToDate(this.local_data.date))
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
    this.absentForm = this.fb.group({
      employeeList: ['',Validators.required],
      day: ['',Validators.required],
      date: new Date()
    })
  }

  doAction() {
    const payload = {
      employeeList: this.absentForm.value.employeeList,
      day: this.absentForm.value.day,
      date: this.absentForm.value.date
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