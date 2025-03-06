import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgForOf } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';

interface month {
  value: string;
  viewValue: string;
}

export interface revenueChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-revenue-updates',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, NgForOf],
  templateUrl: './revenue-updates.component.html',
})
export class AppRevenueUpdatesComponent  implements OnInit{
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public revenueChart!: Partial<revenueChart> | any;

  months: month[] = [
    { value: 'jan',  viewValue: 'January 2025' },
    { value: 'feb',  viewValue: 'February 2025' },
    { value: 'mar',  viewValue: 'March 2025' },
    { value: 'apr',  viewValue: 'April 2025' },
    { value: 'may',  viewValue: 'May 2025' },
    { value: 'jun',  viewValue: 'June 2025' },
    { value: 'jul',  viewValue: 'July 2025' },
    { value: 'aug',  viewValue: 'August 2025' },
    { value: 'sep',  viewValue: 'September 2025' },
    { value: 'oct',  viewValue: 'October 2025' },
    { value: 'nov',  viewValue: 'November 2025' },
    { value: 'dec',  viewValue: 'December 2025' }
  ];

  currentMonth: string = new Date().toLocaleString('en-US', { month: 'short' }).toLowerCase();
  expensesList: any = []; 
  totalexpensesAmount: number = 0;
  incomeMasterData: any = []; 
  totalincomeAmount: number = 0;
  remainingBalance: number = 0;
  filteredExpenses: any[] = [];
  filteredIncome: any[] = [];

  constructor(private commonService:CommonService) {
    this.revenueChart = {
      series: [
        {
          name: 'Eanings this month',
          data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0],
          color: '#5D87FF',
        },
        {
          name: 'Expense this month',
          data: [-1.8, -1.1, -2.5, -1.5, -0.6, -1.8],
          color: '#49BEFF',
        },
      ],

      chart: {
        type: 'bar',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 380,
        stacked: true,
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          borderRadius: [6],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },

      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      yaxis: {
        min: -5,
        max: 5,
        tickAmount: 4,
      },
      xaxis: {
        categories: [
          "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
        ],
        axisBorder: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
      },
    };
  }
  
  ngOnInit(): void {
    this.getExpensesListData();
    this.getIncomeMasterList();
  }

  getExpensesListData() {
    this.commonService.fetchData('ExpensesList', this.expensesList)
      .then(() => {
        if (Array.isArray(this.expensesList)) {
          this.filterDataByMonth();
        } else {
          console.error("Expenses list is not an array:", this.expensesList);
        }
      })
      .catch(error => console.error("Error fetching expenses:", error));
  }

  getIncomeMasterList() {
    this.commonService.fetchData('IncomeMasterList', this.incomeMasterData)
      .then(() => {
        if (Array.isArray(this.incomeMasterData)) {
          this.filterDataByMonth();
        } else {
          console.error("Income master list is not an array:", this.incomeMasterData);
        }
      })
      .catch(error => console.error("Error fetching income data:", error));
  }

  filterDataByMonth() {
    this.filteredExpenses = this.expensesList.filter((expense:any) => {
      return this.getMonthFromDate(expense.date) === this.currentMonth;
    });

    this.filteredIncome = this.incomeMasterData.filter((income:any) => {
      return this.getMonthFromDate(income.AmountDate) === this.currentMonth;
    });

    this.totalexpensesAmount = this.filteredExpenses
      .filter(expense => expense.status?.toLowerCase() === 'paid')
      .reduce((sum, expense) => sum + (expense.amount ? Number(expense.amount) : 0), 0);

    this.totalincomeAmount = this.filteredIncome
      .reduce((sum, income) => sum + (income.Amount ? Number(income.Amount) : 0), 0);

    this.updateRemainingBalance();
  }

  getMonthFromDate(date: any): string {
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let parsedDate: Date;
    if (date && date.seconds) {
      parsedDate = new Date(date.seconds * 1000);
    } else if (typeof date === 'string') {
      parsedDate = new Date(date);
    } else {
      console.error("Invalid date format:", date);
      return ''; 
    }
    return monthNames[parsedDate.getMonth()];
  }

  updateRemainingBalance() {
    this.remainingBalance = this.totalincomeAmount - this.totalexpensesAmount;
  }

  onMonthChange(event: any) {
    this.currentMonth = event.value;
    this.filterDataByMonth();
  }
}
