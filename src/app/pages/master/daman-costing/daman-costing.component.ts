import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daman-costing',
  templateUrl: './daman-costing.component.html',
  styleUrls: ['./daman-costing.component.scss']
})
export class DamanCostingComponent implements OnInit {
  
  areaHead: string = '400';
  designType = "daman"; 

  stitchesValue : number = 105871;
  headValue : number = 2.5;
  finalStitchesValue : number = 265;
  priceValue : number = 0.62;
  machineStichesValue : number = 250000;
  designStich : number = 105871;
  mtrFrameValue : number = 6;
  employeeSalaryValue : number = 566;

  stitchesHeadTotal : any;
  meterTotal : any;
  framesDayTotal : any;
  finalMeter : any;
  empSalarymt : any;

  designEstimate : any = [
    {
      name : 'Sequance-3 MM',
      no : 166500,
      price : 48,
      item :6806
    },
    {
      name : 'Sequance-5 MM',
      no : 1530,
      price : 90,
      item : 0
    },
    {
      name : 'Dhaga-Reco',
      no : 1800,
      price : 763,
      item : 763
    },
    {
      name : 'Dhaga-German',
      no : 17,
      price : 0,
      item : 0
    },
    {
      name : 'Dhaga-viscos',
      no : 1100,
      price : 0,
      item : 0
    },
    {
      name : 'Bobin',
      no : 1880,
      price : 6,
      item : 326
    },
    {
      name : 'Jari',
      no : 7000,
      price : 70,
      item : 0
    },
    {
      name : 'Foil',
      no : 2000,
      price : 70,
      item : 0
    },
    {
      name : 'Col-12',
      no : 650,
      price : 120,
      item : 0
    }

  ]

  constructor(){}


  ngOnInit(): void {
   this.machineStitchesTotal() 
   this.perMeterTotal() 
   this.machineDesignStich()
   this.framesDayMtrFrame()
   this.employeeSalaryFinalMeter()
  }

  machineStitchesTotal(){
    this.stitchesHeadTotal = this.stitchesValue * this.headValue;
  }

  perMeterTotal() {
    this.meterTotal = this.finalStitchesValue * this.priceValue
  }

  machineDesignStich(){
   this.framesDayTotal = this.machineStichesValue / this.designStich
  }

  framesDayMtrFrame(){
    this.finalMeter = this.framesDayTotal * this.mtrFrameValue
  }

  employeeSalaryFinalMeter(){
    this.empSalarymt = this.employeeSalaryValue / this.finalMeter
  }




}
