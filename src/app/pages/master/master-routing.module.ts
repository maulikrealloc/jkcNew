import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyMasterComponent } from './party-master/party-master.component';
import { FirmMasterComponent } from './firm-master/firm-master.component';
import { FullComponent } from 'src/app/layouts/full/full.component';
import { DesignMasterComponent } from './design-master/design-master.component';
import { MaintenanceMasterComponent } from './maintenance-master/maintenance-master.component';
import { CompanyAccountComponent } from './company-account/company-account.component';
import { OrderComponent } from './order/order.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { KhatabookComponent } from './khatabook/khatabook.component';
import { KharchMasterComponent } from './kharch-master/kharch-master.component';
import { ChalanListComponent } from './chalan-list/chalan-list.component';
import { ChalanComponent } from './chalan/chalan.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { AccountComponent } from './account/account.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { KharchBookComponent } from './kharch-book/kharch-book.component';
import { KhataMasterComponent } from './khata-master/khata-master.component';
import { RowMaterialComponent } from './row-material/row-material.component';
import { WithdrawalListComponent } from './withdrawal-list/withdrawal-list.component';
import { BonusListComponent } from './bonus-list/bonus-list.component';
import { MachineSalaryListComponent } from './machine-salary-list/machine-salary-list.component';
import { DamanCostingComponent } from './daman-costing/daman-costing.component';
import { EmployeeReportComponent } from './employee-report/employee-report.component';

export const MasterRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'partymaster',
        component: PartyMasterComponent,
        data: {
          title: 'Party Master',
          urls: [
            { title: 'Master', url: '/master/partymaster' },
            { title: 'Party Master' },
          ],
        },
      },
      {
        path: 'firmmaster',
        component: FirmMasterComponent,
        data: {
          title: 'Firm Master',
          urls: [
            { title: 'Master', url: '/master/firmmaster' },
            { title: 'Firm Master' },
          ],
        },
      },
      {
        path: 'designmaster',
        component: DesignMasterComponent,
        data: {
          title: 'Design Master',
          urls: [
            { title: 'Master', url: '/master/designmaster' },
            { title: 'Design Master' },
          ],
        },
      },
      {
        path: 'maintenancemasters',
        component: MaintenanceMasterComponent,
        data: {
          title: 'Maintenance Masters',
          urls: [
            { title: 'Master', url: '/master/maintenancemasters' },
            { title: 'Maintenance Masters' },
          ],
        },
      },
      {
        path: 'companyaccount',
        component: CompanyAccountComponent,
        data: {
          title: 'Company Account',
          urls: [
            { title: 'Master', url: '/master/companyaccount' },
            { title: 'Company Account' },
          ],
        },
      },
      {
        path: 'order',
        component: OrderComponent,
        data: {
          title: 'Order',
          urls: [
            { title: 'Master', url: '/master/order' },
            { title: 'Order' },
          ],
        },
      },
      {
        path: 'employee',
        component: EmployeeMasterComponent,
        data: {
          title: 'Employee',
          urls: [
            { title: 'Master', url: '/master/employee' },
            { title: 'Employee' },
          ],
        },
      },
      {
        path: 'khatabook',
        component: KhatabookComponent,
        data: {
          title: 'Khatabook',
          urls: [
            { title: 'Master', url: '/master/khatabook' },
            { title: 'Khatabook' },
          ],
        },
      },
      {
        path: 'costing',
        component: DamanCostingComponent,
        data: {
          title: 'Daman Costing',
          urls: [
            { title: 'Master', url: '/master/costing' },
            { title: 'Daman Costing' },
          ],
        },
      },
      {
        path: 'kharchmaster',
        component: KharchMasterComponent,
        data: {
          title: 'Kharch Master',
          urls: [
            { title: 'Master', url: '/master/kharchmaster' },
            { title: 'Kharch Master' },
          ],
        },
      },
      {
        path: 'chalanlist',
        component: ChalanListComponent,
        data: {
          title: 'Chalan List',
          urls: [
            { title: 'Master', url: '/master/chalanlist' },
            { title: 'Chalan List' },
          ],
        },
      },
      {
        path: 'chalan',
        component: ChalanComponent,
        data: {
          title: 'Chalan',
          urls: [
            { title: 'Master', url: '/master/chalan' },
            { title: 'Chalan' },
          ],
        },
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        data: {
          title: 'Invoice',
          urls: [
            { title: 'Master', url: '/master/invoice' },
            { title: 'Invoice' },
          ],
        },
      },
      {
        path: 'invoicelist',
        component: InvoiceListComponent,
        data: {
          title: 'Invoice List',
          urls: [
            { title: 'Master', url: '/master/invoicelist' },
            { title: 'Invoice List' },
          ],

        },
      },
      {
        path: 'account',
        component: AccountComponent,
        data: {
          title: 'Account',
          urls: [
            { title: 'Master', url: '/master/account' },
            { title: 'Account' },
          ],

        },
      },
      {
        path: 'absent',
        component: AttendanceComponent,
        data: {
          title: 'Absent',
          urls: [
            { title: 'Master', url: '/master/absent' },
            { title: 'Absent' },
          ],

        },
      },
      {
        path: 'kharchbook',
        component: KharchBookComponent,
        data: {
          title: 'Kharch Book',
          urls: [
            { title: 'Master', url: '/master/kharchbook' },
            { title: 'Kharch Book' },
          ],

        },
      },
      {
        path: 'khatamaster',
        component: KhataMasterComponent,
        data: {
          title: 'Khata Master',
          urls: [
            { title: 'Master', url: '/master/khatamaster' },
            { title: 'Khata Master' },
          ],
        },
      },
      {
        path: 'rowmaterial',
        component: RowMaterialComponent,
        data: {
          title: 'Raw Material',
          urls: [
            { title: 'Master', url: '/master/rowmaterial' },
            { title: 'Raw Material' },
          ],
        },
      },
      {
        path: 'withdrawallist',
        component: WithdrawalListComponent,
        data: {
          title: 'Withdrawal List',
          urls: [
            { title: 'Master', url: '/master/withdrawallist' },
            { title: 'Withdrawal List' },
          ],
        },
      },
      {
        path: 'bonuslist',
        component: BonusListComponent,
        data: {
          title: 'Bonus List',
          urls: [
            { title: 'Master', url: '/master/bonuslist' },
            { title: 'Bonus List' },
          ],
        },
      },
      {
        path: 'employee-report',
        component: EmployeeReportComponent,
        data: {
          title: 'Report List',
          urls: [
            { title: 'Master', url: '/master/employee-report' },
            { title: 'Report List' },
          ],
        },
      },
      {
        path: 'machinesalarylist',
        component: MachineSalaryListComponent,
        data: {
          title: 'Ex.Machine Salary List',
          urls: [
            { title: 'Master', url: '/master/machinesalarylist' },
            { title: 'Ex.Machine Salary List' },
          ],
        },
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(MasterRoutes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
