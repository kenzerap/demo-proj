import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDefectiveThinCircleComponent } from './svg-defective-thin-circle.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgDefectiveThinCircleComponent', () => {
  let component: SvgDefectiveThinCircleComponent;
  let fixture: ComponentFixture<SvgDefectiveThinCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgDefectiveThinCircleComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgDefectiveThinCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
