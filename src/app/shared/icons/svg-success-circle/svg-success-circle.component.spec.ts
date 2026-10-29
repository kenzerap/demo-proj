import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSuccessCircleComponent } from './svg-success-circle.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgSuccessCircleComponent', () => {
  let component: SvgSuccessCircleComponent;
  let fixture: ComponentFixture<SvgSuccessCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgSuccessCircleComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgSuccessCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
