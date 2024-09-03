import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalanListComponent } from './chalan-list.component';

describe('ChalanListComponent', () => {
  let component: ChalanListComponent;
  let fixture: ComponentFixture<ChalanListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChalanListComponent]
    });
    fixture = TestBed.createComponent(ChalanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
