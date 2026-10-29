import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExportComponent } from './svg-export.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgExportComponent', () => {
  let component: SvgExportComponent;
  let fixture: ComponentFixture<SvgExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExportComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
