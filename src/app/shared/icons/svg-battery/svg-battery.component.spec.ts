import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgBatteryComponent } from './svg-battery.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgBatteryComponent', () => {
  let component: SvgBatteryComponent;
  let fixture: ComponentFixture<SvgBatteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgBatteryComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
