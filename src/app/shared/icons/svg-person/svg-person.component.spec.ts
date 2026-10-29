import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPersonComponent } from './svg-person.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgPersonComponent', () => {
  let component: SvgPersonComponent;
  let fixture: ComponentFixture<SvgPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPersonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
