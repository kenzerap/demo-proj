import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgShieldCrossComponent } from './svg-shield-cross.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgShieldCrossComponent', () => {
  let component: SvgShieldCrossComponent;
  let fixture: ComponentFixture<SvgShieldCrossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgShieldCrossComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgShieldCrossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
