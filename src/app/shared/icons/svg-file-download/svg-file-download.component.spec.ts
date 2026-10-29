import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgFileDownloadComponent } from './svg-file-download.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgFileDownloadComponent', () => {
  let component: SvgFileDownloadComponent;
  let fixture: ComponentFixture<SvgFileDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgFileDownloadComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgFileDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
