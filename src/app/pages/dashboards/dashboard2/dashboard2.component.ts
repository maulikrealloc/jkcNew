import { Component } from '@angular/core';

import { AppWeeklyStatsComponent } from '../../../components/dashboard1/weekly-stats/weekly-stats.component';

@Component({
  selector: 'app-dashboard2',
  standalone: true,
  imports: [
    AppWeeklyStatsComponent
  ],
  templateUrl: './dashboard2.component.html',
})
export class AppDashboard2Component {
  constructor() {}
}
