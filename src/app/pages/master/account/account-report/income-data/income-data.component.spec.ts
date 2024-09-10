import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDataComponent } from './income-data.component';

describe('IncomeDataComponent', () => {
  let component: IncomeDataComponent;
  let fixture: ComponentFixture<IncomeDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeDataComponent]
    });
    fixture = TestBed.createComponent(IncomeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
