import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPenSquareComponent } from './svg-pen-square.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgPenSquareComponent', () => {
  let component: SvgPenSquareComponent;
  let fixture: ComponentFixture<SvgPenSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgPenSquareComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgPenSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
