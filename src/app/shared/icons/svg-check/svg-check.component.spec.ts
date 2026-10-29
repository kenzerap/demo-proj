import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCheckComponent } from './svg-check.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgCheckComponent', () => {
  let component: SvgCheckComponent;
  let fixture: ComponentFixture<SvgCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgCheckComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
