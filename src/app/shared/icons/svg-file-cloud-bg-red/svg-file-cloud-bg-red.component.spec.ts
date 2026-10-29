import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgFileCloudBgRedComponent } from './svg-file-cloud-bg-red.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgFileCloudBgRedComponent', () => {
  let component: SvgFileCloudBgRedComponent;
  let fixture: ComponentFixture<SvgFileCloudBgRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgFileCloudBgRedComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgFileCloudBgRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
