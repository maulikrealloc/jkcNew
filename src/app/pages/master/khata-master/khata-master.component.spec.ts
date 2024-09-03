import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhataMasterComponent } from './khata-master.component';

describe('KhataMasterComponent', () => {
  let component: KhataMasterComponent;
  let fixture: ComponentFixture<KhataMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KhataMasterComponent]
    });
    fixture = TestBed.createComponent(KhataMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
