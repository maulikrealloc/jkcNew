import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KharchReportComponent } from './kharch-report.component';

describe('KharchReportComponent', () => {
  let component: KharchReportComponent;
  let fixture: ComponentFixture<KharchReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KharchReportComponent]
    });
    fixture = TestBed.createComponent(KharchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
