import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CompanyAccountDialogComponent } from './company-account-dialog/company-account-dialog.component';


@Component({
  selector: 'app-company-account',
  templateUrl: './company-account.component.html',
  styleUrls: ['./company-account.component.scss']
})
export class CompanyAccountComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'accountName',
    'bankName',
    'openingBalance',
    'date',
    'action',
  ];
  
  companyAccount: any = [];


  dataSource = new MatTableDataSource(this.companyAccount);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(CompanyAccountDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.companyAccount.push({
          id: this.companyAccount.length + 1,
          accountName: result.data.accountName,
          bankName: result.data.bankName,
          openingBalance: result.data.openingBalance,
          date: result.data.date,
        })
        this.dataSource = new MatTableDataSource(this.companyAccount);

      }
      if (result.event === 'Edit') {
        this.companyAccount.forEach((element: any) => {

          if (element.id === result.data.id) {
            element.id = result.data.id
            element.accountName = result.data.accountName
            element.bankName = result.data.bankName
            element.openingBalance = result.data.openingBalance
            element.date = result.data.date
          }
        });
        this.dataSource = new MatTableDataSource(this.companyAccount);
      }
      if (result.event === 'Delete') {
        const allEmployeesData = this.companyAccount
        this.companyAccount = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.companyAccount);
      }
    });
  }

}
