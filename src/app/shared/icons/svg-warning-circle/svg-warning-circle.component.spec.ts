import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgWarningCircleComponent } from './svg-warning-circle.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgWarningCircleComponent', () => {
  let component: SvgWarningCircleComponent;
  let fixture: ComponentFixture<SvgWarningCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgWarningCircleComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgWarningCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
