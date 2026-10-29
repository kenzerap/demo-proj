import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgBtnDownloadComponent } from './svg-btn-download.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgBtnDownloadComponent', () => {
  let component: SvgBtnDownloadComponent;
  let fixture: ComponentFixture<SvgBtnDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgBtnDownloadComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgBtnDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
