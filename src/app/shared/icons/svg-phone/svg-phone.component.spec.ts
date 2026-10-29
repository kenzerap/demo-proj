import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPhoneComponent } from './svg-phone.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgPhoneComponent', () => {
  let component: SvgPhoneComponent;
  let fixture: ComponentFixture<SvgPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPhoneComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
