import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCloudUploadComponent } from './svg-cloud-upload.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgCloudUploadComponent', () => {
  let component: SvgCloudUploadComponent;
  let fixture: ComponentFixture<SvgCloudUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgCloudUploadComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgCloudUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
