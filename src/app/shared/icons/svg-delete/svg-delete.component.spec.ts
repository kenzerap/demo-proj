import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDeleteComponent } from './svg-delete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgDeleteComponent', () => {
  let component: SvgDeleteComponent;
  let fixture: ComponentFixture<SvgDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgDeleteComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
