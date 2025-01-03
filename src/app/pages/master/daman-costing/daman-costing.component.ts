import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daman-costing',
  templateUrl: './daman-costing.component.html',
  styleUrls: ['./daman-costing.component.scss']
})
export class DamanCostingComponent implements OnInit {

  areaHead: string = '400';
  designType = "daman";
  no: number | null = null;
  stitchesValue: number = 105871;
  headValue: number = 2.5;
  finalStitches: number = 265;
  priceValue: number = 0.62;
  machineStichesValue: number = 250000;
  mtrFrameValue: number = 6;
  employeeSalaryValue: number = 566;
  cut: number = 6;
  stitchesHeadTotal: any;
  meterTotal: any;
  framesDayTotal: any;
  finalMeter: any;
  empSalarymt: any;
  taxAmount: any;
  finalPrice: any;

  designEstimate: any = [
    {
      name: 'Sequance-3 MM',
      no: 166500,
      price: 48,
      item: 6806
    },
    {
      name: 'Sequance-5 MM',
      no: 1530,
      price: 90,
      item: 0
    },
    {
      name: 'Dhaga-Reco',
      no: 1800,
      price: 25,
      item: 763
    },
    {
      name: 'Dhaga-German',
      no: 1800,
      price: 17,
      item: 0
    },
    {
      name: 'Dhaga-viscos',
      no: 1100,
      price: 27.5,
      item: 0
    },
    {
      name: 'Bobin',
      no: 1880,
      price: 6,
      item: 326
    },
    {
      name: 'Jari',
      no: 7000,
      price: 70,
      item: 0
    },
    {
      name: 'Foil',
      no: 2000,
      price: 70,
      item: 0
    },
    {
      name: 'Col-12',
      no: 650,
      price: 120,
      item: 0
    }
  ]

  constructor() { }

  ngOnInit(): void {
    this.getFinalStitches();
    this.getPerMeter();
    this.getFrameDay();
    this.getFinalMeter();
    this.getEmpSalartMt();
    this.areaHeadChanges();
    this.designTypeChanges();
  }

  getFinalStitches() {
    this.stitchesHeadTotal = (this.stitchesValue * this.headValue).toFixed(2);
    this.finalStitches = parseFloat((this.stitchesHeadTotal / 1000).toFixed(0));
    this.meterTotal = (this.finalStitches * this.priceValue).toFixed(2);
    this.framesDayTotal = (this.machineStichesValue / this.stitchesValue).toFixed(2);
    this.finalMeter = (this.framesDayTotal * this.mtrFrameValue).toFixed(2);
    this.empSalarymt = (this.employeeSalaryValue / this.finalMeter).toFixed(2);
    this.taxAmount = (this.meterTotal * this.cut / 100).toFixed(2);
    this.finalPrice = (parseFloat(this.meterTotal) + parseFloat(this.taxAmount)).toFixed(2);

    if (this.designType === 'choli') {
      this.stitchesHeadTotal = this.stitchesValue * 1.5;
      this.finalStitches = parseFloat((this.stitchesHeadTotal / 1000).toFixed(0));
      this.meterTotal = (this.finalStitches * this.priceValue).toFixed(2);
      this.taxAmount = (this.meterTotal * this.cut / 100).toFixed(2);
      this.finalPrice = (parseFloat(this.meterTotal) + parseFloat(this.taxAmount)).toFixed(2);
    }
  }

  getPerMeter() {
    this.meterTotal = (this.finalStitches * this.priceValue).toFixed(2);
    this.taxAmount = (this.meterTotal * this.cut / 100).toFixed(2);
    this.finalPrice = (parseFloat(this.meterTotal) + parseFloat(this.taxAmount)).toFixed(2);
  }

  getFrameDay() {
    this.framesDayTotal = (this.machineStichesValue / this.stitchesValue).toFixed(2);
    this.finalMeter = (this.framesDayTotal * this.mtrFrameValue).toFixed(2);
    this.empSalarymt = (this.employeeSalaryValue / this.finalMeter).toFixed(2);
  }

  getFinalMeter() {
    this.finalMeter = (this.framesDayTotal * this.mtrFrameValue).toFixed(2);
    this.taxAmount = (this.meterTotal * this.cut / 100).toFixed(2);
    this.finalPrice = (parseFloat(this.meterTotal) + parseFloat(this.taxAmount)).toFixed(2);
    this.empSalarymt = (this.employeeSalaryValue / this.finalMeter).toFixed(2);
  }

  getEmpSalartMt() {
    this.empSalarymt = (this.employeeSalaryValue / this.finalMeter).toFixed(2);
  }

  designEstimateTotal(item: any): string {
    const total = (item.item || 0) * this.headValue;
    return total.toFixed(2);
  }

  designEstimateAmount(item: any): string {
    const amount = (item.item || 0) * this.headValue * (item.price || 0) / (item.no || 0);
    return amount.toFixed(2);
  }

  getTotalAmount(): string {
    const total = this.designEstimate.reduce((sum: number, item: any) => {
      const amount = (item.item || 0) * this.headValue * (item.price || 0) / (item.no || 0);
      return sum + amount;
    }, 0);
    return total.toFixed(2);
  }

  getNetProfit(): string {
    const netProfitValue = (this.meterTotal || 0) - parseFloat(this.getTotalAmount());
    return netProfitValue.toFixed(2);
  }

  getProfitPercentage(): string {
    if (this.meterTotal && this.meterTotal > 0) {
      const profit = parseFloat(this.getNetProfit()) * 100 / this.meterTotal;
      return profit.toFixed(2);
    }
    return "0.00";
  }

  areaHeadChanges() {
    if (this.areaHead === '400') {
      this.headValue = 2.5;
      this.mtrFrameValue = 6;
      this.employeeSalaryValue = 566;
      this.getFinalStitches();
      this.getPerMeter();
      this.getFrameDay();
      this.getFinalMeter();
      this.getEmpSalartMt();

    } if (this.areaHead === '250') {
      this.headValue = 4;
      this.mtrFrameValue = 6.75;
      this.employeeSalaryValue = 666;
      this.getFinalStitches();
      this.getPerMeter();
      this.getFrameDay();
      this.getFinalMeter();
      this.getEmpSalartMt();
    }
  }

  designTypeChanges() {
    if (this.designType === 'less') {
      this.no = 18;
    } else if (this.designType === 'choli') {
      this.no = 2.5;
    } else {
      this.no = null;
    }

    if (this.designType === 'daman') {
      this.stitchesValue = 105871;
      this.headValue = 2.5;
      this.finalStitches = 265;
      this.priceValue = 0.62;
      this.machineStichesValue = 250000;
      this.mtrFrameValue = 6;
      this.employeeSalaryValue = 566;
      this.getFinalStitches();
      this.getPerMeter();
      this.getFrameDay();
      this.getFinalMeter();
      this.getEmpSalartMt();

    } if (this.designType === 'choli') {
      this.headValue = 1;
      this.mtrFrameValue = 8;
      this.getFinalStitches();
      this.getPerMeter();
      this.getFrameDay();
      this.getFinalMeter();
      this.getEmpSalartMt();

    } else {
      this.stitchesValue = 105871;
      this.headValue = 2.5;
      this.finalStitches = 265;
      this.priceValue = 0.62;
      this.machineStichesValue = 250000;
      this.mtrFrameValue = 6;
      this.employeeSalaryValue = 566;
      this.getFinalStitches();
      this.getPerMeter();
      this.getFrameDay();
      this.getFinalMeter();
      this.getEmpSalartMt();
    }
  }

}