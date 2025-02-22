import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterRoutes, MasterRoutingModule } from './master-routing.module';
import { PartyMasterComponent, partyMasterDialogComponent } from './party-master/party-master.component';
import { FirmMasterComponent, firmMasterDialogComponent } from './firm-master/firm-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';
import { DesignMasterComponent, designMasterDialogComponent } from './design-master/design-master.component';
import { MaintenanceMasterDialogComponent } from './maintenance-master/maintenance-master-dialog/maintenance-master-dialog.component';
import { CompanyAccountComponent } from './company-account/company-account.component';
import { CompanyAccountDialogComponent } from './company-account/company-account-dialog/company-account-dialog.component';
import { OrderComponent } from './order/order.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { EmployeeDialogComponent } from './employee-master/employee-dialog/employee-dialog.component';
import { KhatabookComponent } from './khatabook/khatabook.component';
import { OrderDialogComponent } from './order/order-dialog/order-dialog.component';
import { OrderListComponent } from './khatabook/order-list/order-list.component';
import { OrderListDialogComponent } from './khatabook/order-list/order-list-dialog/order-list-dialog.component';
import { ReportComponent } from './khatabook/report/report.component';
import { KharchMasterComponent } from './kharch-master/kharch-master.component';
import { ChalanListComponent } from './chalan-list/chalan-list.component';
import { ChalanComponent } from './chalan/chalan.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { AccountComponent } from './account/account.component';
import { ExpensesComponent } from './account/expenses/expenses.component';
import { IncomeComponent } from './account/income/income.component';
import { PassbookComponent } from './account/passbook/passbook.component';
import { AccountReportComponent } from './account/account-report/account-report.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AbsentDialogComponent } from './attendance/absent-dialog/absent-dialog.component';
import { KharchBookComponent } from './kharch-book/kharch-book.component';
import { KhataMasterComponent } from './khata-master/khata-master.component';
import { AddKharchComponent } from './kharch-book/add-kharch/add-kharch.component';
import { AddKharchDialogComponent } from './kharch-book/add-kharch/add-kharch-dialog/add-kharch-dialog.component';
import { KharchReportComponent } from './kharch-book/kharch-report/kharch-report.component';
import { KhataMasterDialogComponent } from './khata-master/khata-master-dialog/khata-master-dialog.component';
import { RowMaterialComponent } from './row-material/row-material.component';
import { RowMaterialDialogComponent } from './row-material/row-material-dialog/row-material-dialog.component';
import { WithdrawalListComponent } from './withdrawal-list/withdrawal-list.component';
import { BonusListComponent } from './bonus-list/bonus-list.component';
import { MachineSalaryListComponent } from './machine-salary-list/machine-salary-list.component';
import { WithdrawalListDialogComponent } from './withdrawal-list/withdrawal-list-dialog/withdrawal-list-dialog.component';
import { BonusListDialogComponent } from './bonus-list/bonus-list-dialog/bonus-list-dialog.component';
import { MachineSalaryDialogComponent } from './machine-salary-list/machine-salary-dialog/machine-salary-dialog.component';
import { MaintenanceMasterComponent } from './maintenance-master/maintenance-master.component';
import { ExpensesDialogComponent } from './account/expenses/expenses-dialog/expenses-dialog.component';
import { ExpensesmasterDialogComponent } from './account/expenses/expensesmaster-dialog/expensesmaster-dialog.component';
import { TransferDialogComponent } from './account/income/transfer-dialog/transfer-dialog.component';
import { IncomeDialogComponent } from './account/income/income-dialog/income-dialog.component';
import { ExpensesDataComponent } from './account/account-report/expenses-data/expenses-data.component';
import { IncomeDataComponent } from './account/account-report/income-data/income-data.component';
import { PaidByDataComponent } from './account/account-report/paid-by-data/paid-by-data.component';
import { NetProfitDataComponent } from './account/account-report/net-profit-data/net-profit-data.component';
import { DamanCostingComponent } from './daman-costing/daman-costing.component';
import { ProductDialogComponent } from './chalan-list/product-dialog/product-dialog.component';
import { PaymentListComponent } from './invoice-list/payment-list/payment-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChalanViewDialogComponent } from './chalan/chalan-view-dialog/chalan-view-dialog.component';
import { EmployeeReportComponent } from './employee-report/employee-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PartyMasterComponent,
    FirmMasterComponent,
    partyMasterDialogComponent,
    firmMasterDialogComponent,
    DesignMasterComponent,
    designMasterDialogComponent,
    MaintenanceMasterComponent,
    MaintenanceMasterDialogComponent,
    CompanyAccountComponent,
    CompanyAccountDialogComponent,
    OrderComponent,
    OrderDialogComponent,
    EmployeeMasterComponent,
    EmployeeDialogComponent,
    KhatabookComponent,
    OrderListComponent,
    OrderListDialogComponent,
    ReportComponent,
    KharchMasterComponent,
    ChalanListComponent,
    ChalanComponent,
    InvoiceComponent,
    InvoiceListComponent,
    AccountComponent,
    ExpensesComponent,
    IncomeComponent,
    PassbookComponent,
    AccountReportComponent,
    AttendanceComponent,
    AbsentDialogComponent,
    KharchBookComponent,
    KhataMasterComponent,
    AddKharchComponent,
    AddKharchDialogComponent,
    KharchReportComponent,
    KhataMasterDialogComponent,
    RowMaterialComponent,
    RowMaterialDialogComponent,
    WithdrawalListComponent,
    BonusListComponent,
    MachineSalaryListComponent,
    WithdrawalListDialogComponent,
    BonusListDialogComponent,
    MachineSalaryDialogComponent,
    ExpensesDialogComponent,
    ExpensesmasterDialogComponent,
    TransferDialogComponent,
    IncomeDialogComponent,
    ExpensesDataComponent,
    IncomeDataComponent,
    PaidByDataComponent,
    NetProfitDataComponent,
    DamanCostingComponent,
    ProductDialogComponent,
    PaymentListComponent,
    ChalanViewDialogComponent,
    EmployeeReportComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    RouterModule.forChild(MasterRoutes),
    MaterialModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgApexchartsModule,
    MatPaginatorModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class MasterModule { }
