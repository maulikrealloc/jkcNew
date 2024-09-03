import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAccountDialogComponent } from './company-account-dialog.component';

describe('CompanyAccountDialogComponent', () => {
  let component: CompanyAccountDialogComponent;
  let fixture: ComponentFixture<CompanyAccountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyAccountDialogComponent]
    });
    fixture = TestBed.createComponent(CompanyAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
