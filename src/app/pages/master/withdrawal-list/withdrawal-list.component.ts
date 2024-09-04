import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WithdrawalListDialogComponent } from './withdrawal-list-dialog/withdrawal-list-dialog.component';


export interface withdrawalData {
  id: number,
  employeeList: string,
  amount: string,
  date: string,
}

@Component({
  selector: 'app-withdrawal-list',
  templateUrl: './withdrawal-list.component.html',
  styleUrls: ['./withdrawal-list.component.scss']
})
export class WithdrawalListComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'employee',
    'amount',
    'date',
    'action',
  ];
  employees: any = [
    {
      id: 1,
      employeeList: 'Jay',
      amount: '565',
      date: '04/01/2021',
    }
  ];

  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(WithdrawalListDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addwithdrawalData(result.data);
      } else if (result.event === 'Edit') {
        this.updatewithdrawalData(result.data);
      } else if (result.event === 'Delete') {
        this.deletewithdrawalData(result.data);
      }
    })
  }

    addwithdrawalData(row_obj: withdrawalData){
      this.employees.push({
              id: this.employees.length + 1,
              employeeList: row_obj.employeeList,
              amount: row_obj.amount,
              date: row_obj.date
            })
            this.dataSource = new MatTableDataSource(this.employees);
            console.log('=====>>>> addwithdrawalData <<<<=====',this.employees);    
    }

    updatewithdrawalData(row_obj: withdrawalData){
      this.dataSource.data = this.dataSource.data.filter((value: any) =>{
        if (value.id === row_obj.id) {
          value.employeeList = row_obj.employeeList,
          value.amount = row_obj.amount,
          value.date = row_obj.date
        }
        return true;
      })
      this.dataSource = new MatTableDataSource(this.employees);
    }

    deletewithdrawalData(row_obj: withdrawalData){
      const allEmployeesData = this.employees
    this.employees = allEmployeesData.filter((id:any) => id.id !== row_obj.id)
    this.dataSource = new MatTableDataSource(this.employees)
    }

   
}
