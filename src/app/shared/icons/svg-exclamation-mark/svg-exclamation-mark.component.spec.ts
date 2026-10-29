import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExclamationMarkComponent } from './svg-exclamation-mark.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgExclamationMarkComponent', () => {
  let component: SvgExclamationMarkComponent;
  let fixture: ComponentFixture<SvgExclamationMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExclamationMarkComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgExclamationMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
