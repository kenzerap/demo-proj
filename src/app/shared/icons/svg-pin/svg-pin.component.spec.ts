import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPinComponent } from './svg-pin.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgPinComponent', () => {
  let component: SvgPinComponent;
  let fixture: ComponentFixture<SvgPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPinComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
