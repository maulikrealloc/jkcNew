import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamanCostingComponent } from './daman-costing.component';

describe('DamanCostingComponent', () => {
  let component: DamanCostingComponent;
  let fixture: ComponentFixture<DamanCostingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DamanCostingComponent]
    });
    fixture = TestBed.createComponent(DamanCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
