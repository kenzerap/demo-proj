import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgStarComponent } from './svg-star.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgPersonComponent', () => {
  let component: SvgStarComponent;
  let fixture: ComponentFixture<SvgStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgStarComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
