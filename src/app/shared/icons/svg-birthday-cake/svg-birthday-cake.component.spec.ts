import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgBirthdayCakeComponent } from './svg-birthday-cake.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgBirthdayCakeComponent', () => {
  let component: SvgBirthdayCakeComponent;
  let fixture: ComponentFixture<SvgBirthdayCakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgBirthdayCakeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgBirthdayCakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
