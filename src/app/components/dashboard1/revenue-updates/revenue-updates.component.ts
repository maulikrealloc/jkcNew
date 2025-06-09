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
export class AppRevenueUpdatesComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public revenueChart!: Partial<revenueChart> | any;

  months: month[] = [
    { value: 'jan', viewValue: 'January' },
    { value: 'feb', viewValue: 'February' },
    { value: 'mar', viewValue: 'March' },
    { value: 'apr', viewValue: 'April' },
    { value: 'may', viewValue: 'May' },
    { value: 'jun', viewValue: 'June' },
    { value: 'jul', viewValue: 'July' },
    { value: 'aug', viewValue: 'August' },
    { value: 'sep', viewValue: 'September' },
    { value: 'oct', viewValue: 'October' },
    { value: 'nov', viewValue: 'November' },
    { value: 'dec', viewValue: 'December' }
  ];

  currentMonth: string = new Date().toLocaleString('en-US', { month: 'short' }).toLowerCase();
  expensesList: any = [];
  totalexpensesAmount: number = 0;
  incomeMasterData: any = [];
  totalincomeAmount: number = 0;
  remainingBalance: number = 0;
  monthlyData: { income: number[], expenses: number[] } = { income: [], expenses: [] };

  constructor(private commonService: CommonService) {
    this.initializeChart();
  }

  initializeChart() {
    this.revenueChart = {
      series: [
        {
          name: 'Income',
          data: [],
          color: '#5D87FF',
        },
        {
          name: 'Expenses',
          data: [],
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
        show: true,
        position: 'top',
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
        labels: {
          formatter: (value: number) => {
            return value.toFixed(2);
          }
        }
      },
      xaxis: {
        categories: this.months.map(m => m.value),
        axisBorder: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
        y: {
          formatter: (value: number) => {
            return  value.toFixed(2);
          }
        }
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
          this.prepareMonthlyData();
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
          this.prepareMonthlyData();
        } else {
          console.error("Income master list is not an array:", this.incomeMasterData);
        }
      })
      .catch(error => console.error("Error fetching income data:", error));
  }

  prepareMonthlyData() {
    this.monthlyData = {
      income: new Array(12).fill(0),
      expenses: new Array(12).fill(0)
    };

    this.incomeMasterData.forEach((income: any) => {
      const monthIndex = this.getMonthIndexFromDate(income.AmountDate);
      if (monthIndex >= 0 && monthIndex < 12) {
        this.monthlyData.income[monthIndex] += income.Amount ? Number(income.Amount) : 0;
      }
    });

    this.expensesList.forEach((expense: any) => {
      if (expense.status?.toLowerCase() === 'paid') {
        const monthIndex = this.getMonthIndexFromDate(expense.date);
        if (monthIndex >= 0 && monthIndex < 12) {
          this.monthlyData.expenses[monthIndex] += expense.amount ? Number(expense.amount) : 0;
        }
      }
    });

    this.updateChartData();
    this.updateCurrentMonthData();
  }

  getMonthIndexFromDate(date: any): number {
    let parsedDate: Date;
    if (date && date.seconds) {
      parsedDate = new Date(date.seconds * 1000);
    } else if (typeof date === 'string') {
      parsedDate = new Date(date);
    } else {
      console.error("Invalid date format:", date);
      return -1;
    }
    return parsedDate.getMonth();
  }

  updateChartData() {
    this.revenueChart.series = [
      {
        name: 'Income',
        data: this.monthlyData.income,
        color: '#5D87FF',
      },
      {
        name: 'Expenses',
        data: this.monthlyData.expenses.map(expense => -expense), 
        color: '#49BEFF',
      },
    ];

    const maxIncome = Math.max(...this.monthlyData.income);
    const maxExpense = Math.max(...this.monthlyData.expenses);
    const maxValue = Math.max(maxIncome, maxExpense);

    this.revenueChart.yaxis = {
      ...this.revenueChart.yaxis,
      max: maxValue * 1.2, 
      min: -maxValue * 1.2,
      tickAmount: 6,
      labels: {
        formatter: (value: number) => {
          return  Math.abs(value).toFixed(2);
        }
      }
    };

    if (this.chart) {
      this.chart.updateOptions(this.revenueChart);
    }
  }

  updateCurrentMonthData() {
    const currentMonthIndex = new Date().getMonth();
    this.totalincomeAmount = this.monthlyData.income[currentMonthIndex];
    this.totalexpensesAmount = this.monthlyData.expenses[currentMonthIndex];
    this.remainingBalance = this.totalincomeAmount - this.totalexpensesAmount;
  }

  onMonthChange(event: any) {
    const selectedMonthIndex = this.months.findIndex(m => m.value === event.value);
    if (selectedMonthIndex >= 0) {
      this.totalincomeAmount = this.monthlyData.income[selectedMonthIndex];
      this.totalexpensesAmount = this.monthlyData.expenses[selectedMonthIndex];
      this.remainingBalance = this.totalincomeAmount - this.totalexpensesAmount;
    }
  }
}