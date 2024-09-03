import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalanComponent } from './chalan.component';

describe('ChalanComponent', () => {
  let component: ChalanComponent;
  let fixture: ComponentFixture<ChalanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChalanComponent]
    });
    fixture = TestBed.createComponent(ChalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
