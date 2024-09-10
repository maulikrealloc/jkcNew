import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesDataComponent } from './expenses-data.component';

describe('ExpensesDataComponent', () => {
  let component: ExpensesDataComponent;
  let fixture: ComponentFixture<ExpensesDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensesDataComponent]
    });
    fixture = TestBed.createComponent(ExpensesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
