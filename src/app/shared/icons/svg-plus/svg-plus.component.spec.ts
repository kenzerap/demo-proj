import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPlusComponent } from './svg-plus.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgPlusComponent', () => {
  let component: SvgPlusComponent;
  let fixture: ComponentFixture<SvgPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPlusComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
