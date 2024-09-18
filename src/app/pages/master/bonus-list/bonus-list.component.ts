import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BonusListDialogComponent } from './bonus-list-dialog/bonus-list-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bonus-list',
  templateUrl: './bonus-list.component.html',
  styleUrls: ['./bonus-list.component.scss']
})
export class BonusListComponent {
  dateBonusForm:FormGroup

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  displayedColumns: string[] = [
    '#',
    'employee',
    'amount',
    'date',
    'action',
  ];

  bonusList: any = [
    {
      id: 1,
      employeeList: 'Deep',
      amount: 'Thursday',
      date: '02/08/2022',
    }
  ];

  dataSource = new MatTableDataSource(this.bonusList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb:FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); 
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); 

    this.dateBonusForm = this.fb.group({
      start:[startDate],
      end:[endDate]
    })
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(BonusListDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("result==============>>>", result);

      if (result.event === 'Add') {
        this.bonusList.push({
          id: this.bonusList.length + 1,
          employeeList: result.data.employeeList,
          amount: result.data.amount,
          date: result.data.date
        })
        this.dataSource = new MatTableDataSource(this.bonusList);
      }
      if (result.event === 'Edit') {
        this.bonusList.forEach((element: any) => {

          if (element.id === result.data.id) {
            element.id = result.data.id
            element.employeeList = result.data.employeeList
            element.amount = result.data.amount
            element.date = result.data.date
          }
        });
        this.dataSource = new MatTableDataSource(this.bonusList);
      }
      if (result.event === 'Delete') {
        const allEmployeesData = this.bonusList
        this.bonusList = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.bonusList);
      }
    });
  }
}
