import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGroupComponent } from './svg-group.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgGroupComponent', () => {
  let component: SvgGroupComponent;
  let fixture: ComponentFixture<SvgGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgGroupComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
