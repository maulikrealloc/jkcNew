import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetProfitDataComponent } from './net-profit-data.component';

describe('NetProfitDataComponent', () => {
  let component: NetProfitDataComponent;
  let fixture: ComponentFixture<NetProfitDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetProfitDataComponent]
    });
    fixture = TestBed.createComponent(NetProfitDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
