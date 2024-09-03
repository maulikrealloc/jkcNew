import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMasterComponent } from './design-master.component';

describe('DesignMasterComponent', () => {
  let component: DesignMasterComponent;
  let fixture: ComponentFixture<DesignMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignMasterComponent]
    });
    fixture = TestBed.createComponent(DesignMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
