import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceMasterDialogComponent } from './maintenance-master-dialog.component';

describe('MaintenanceMasterDialogComponent', () => {
  let component: MaintenanceMasterDialogComponent;
  let fixture: ComponentFixture<MaintenanceMasterDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceMasterDialogComponent]
    });
    fixture = TestBed.createComponent(MaintenanceMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
