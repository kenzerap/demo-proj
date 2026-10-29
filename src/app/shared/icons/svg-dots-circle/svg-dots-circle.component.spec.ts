import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDotsCircleComponent } from './svg-dots-circle.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgDotsCircleComponent', () => {
  let component: SvgDotsCircleComponent;
  let fixture: ComponentFixture<SvgDotsCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgDotsCircleComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgDotsCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
