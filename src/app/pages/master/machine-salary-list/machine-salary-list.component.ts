import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MachineSalaryDialogComponent } from './machine-salary-dialog/machine-salary-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-machine-salary-list',
  templateUrl: './machine-salary-list.component.html',
  styleUrls: ['./machine-salary-list.component.scss']
})
export class MachineSalaryListComponent implements OnInit {

  dateMachinesalaryForm: FormGroup;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  machineSalaryColumns: string[] = [
    '#',
    'employee',
    'amount',
    'date',
    'action',
  ];

  machineSalaryList: any = [];
  employeesList: any = [];

  dataSource = new MatTableDataSource(this.machineSalaryList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb:FormBuilder,
    private dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); 
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
    
    this.dateMachinesalaryForm = this.fb.group({
      start:[startDate],
      end:[endDate]
    })
    this.getmachineSalaryData();
    this.getEmployeeData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  getmachineSalaryData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'MachineSalaryList').then((machineSalary) => {
      this.machineSalaryList = machineSalary
      if (machineSalary && machineSalary.length > 0) {
        this.dataSource = new MatTableDataSource(this.machineSalaryList);
      } else {
        this.machineSalaryList = [];
        this.dataSource = new MatTableDataSource(this.machineSalaryList);
      }
    }).catch((error) => {
      console.error('Error fetching machineSalary:', error);
    });
  }

  getEmployeeData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'EmployeeList').then((employee) => {
      this.employeesList = employee
      console.log(this.employeesList, 'empppppppppppppppppp');

    }).catch((error) => {
      console.error('Error fetching employee:', error);
    });
  }

  getEmployeeName(employeeId: string): string {
    return this.employeesList.find((employeeObj: any) => employeeObj.id === employeeId)?.firstName
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(MachineSalaryDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'MachineSalaryList');
        this.getmachineSalaryData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'MachineSalaryList');
        this.getmachineSalaryData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'MachineSalaryList');
        this.getmachineSalaryData();
      }
    });
  }

}