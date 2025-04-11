import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPDFdialogComponent } from './view-pdfdialog.component';

describe('ViewPDFdialogComponent', () => {
  let component: ViewPDFdialogComponent;
  let fixture: ComponentFixture<ViewPDFdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPDFdialogComponent]
    });
    fixture = TestBed.createComponent(ViewPDFdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
