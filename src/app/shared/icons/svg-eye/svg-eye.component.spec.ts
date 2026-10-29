import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEyeComponent } from './svg-eye.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgEyeComponent', () => {
  let component: SvgEyeComponent;
  let fixture: ComponentFixture<SvgEyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgEyeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgEyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
