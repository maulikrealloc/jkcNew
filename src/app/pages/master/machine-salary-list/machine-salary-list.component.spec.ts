import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSalaryListComponent } from './machine-salary-list.component';

describe('MachineSalaryListComponent', () => {
  let component: MachineSalaryListComponent;
  let fixture: ComponentFixture<MachineSalaryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineSalaryListComponent]
    });
    fixture = TestBed.createComponent(MachineSalaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
