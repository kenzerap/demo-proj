import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCompassComponent } from './svg-compass.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgCompassComponent', () => {
  let component: SvgCompassComponent;
  let fixture: ComponentFixture<SvgCompassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgCompassComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgCompassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
