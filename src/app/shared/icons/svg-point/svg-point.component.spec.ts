import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPointComponent } from './svg-point.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgPointComponent', () => {
  let component: SvgPointComponent;
  let fixture: ComponentFixture<SvgPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPointComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
