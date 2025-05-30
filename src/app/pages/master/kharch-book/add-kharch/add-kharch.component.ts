import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ExpensesmasterDialogComponent } from '../../account/expenses/expensesmaster-dialog/expensesmaster-dialog.component';
import { ExpensesDialogComponent } from '../../account/expenses/expenses-dialog/expenses-dialog.component';

@Component({
  selector: 'app-add-kharch',
  templateUrl: './add-kharch.component.html',
  styleUrls: ['./add-kharch.component.scss']
})

export class AddKharchComponent implements OnInit {

  expensesDataColumns: string[] = ['#', 'expensesType', 'date', 'description', 'chalanNo', 'amount', 'paidBy', 'status', 'action'];
  expensesList: any = [];
  expensesmasterList: any = [];
  expenses: any = []
  dateKharchListForm: FormGroup;
  expensesListDataSource = new MatTableDataSource(this.expensesList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private fb: FormBuilder,private dialog: MatDialog, private commonService: CommonService) { }

  ngOnInit(): void {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateKharchListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    })
    this.getExpensesListData();
    this.getExpensesmasterListData();
    this.expensesListDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.expensesListDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  filterDate() {
    if (!this.expensesList) return;
    const startDate = this.dateKharchListForm.value.start ? new Date(this.dateKharchListForm.value.start) : null;
    const endDate = this.dateKharchListForm.value.end ? new Date(this.dateKharchListForm.value.end) : null;
    if (startDate && endDate) {
      this.expensesListDataSource.data = this.expensesList.filter((invoice: any) => {
        if (!invoice.date) return false;

        const invoiceDate = new Date(invoice.date.seconds * 1000);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else {
      this.expensesListDataSource.data = this.expensesList;
    }
  }

  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList, this.expensesListDataSource).then((res) => {
      this.filterData();
    });
  }

  filterData() {
    this.expensesListDataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = [
        data.expensesType,
        this.convertTimestampToDate(data.date)?.toLocaleDateString() || '',
        data.description,
        data.chalanNo,
        data.amount || '',
        data.paidBy,
        data.status
      ].join(' ').toLowerCase();

      return dataStr.includes(filter.toLowerCase());
    };
    this.filterDate()
  }

  getExpensesmasterListData() {
    this.commonService.fetchData('ExpensesmasterList', this.expensesmasterList);
  }

  openExpenses(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(ExpensesDialogComponent, {
      data: obj,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'ExpensesList').then(() => this.getExpensesListData()).catch(console.error);
      }
    });
  }

  // openExpensesMaster(action: string, obj: any) {
  //   obj.action = action;
  //   const dialogRef = this.dialog.open(ExpensesmasterDialogComponent, {
  //     data: obj,
  //   })
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result?.event) {
  //       this.commonService.commonApiCalled(result, obj, 'ExpensesmasterList').then(() => this.getExpensesmasterListData()).catch(console.error);
  //     }
  //   });
  // }
}