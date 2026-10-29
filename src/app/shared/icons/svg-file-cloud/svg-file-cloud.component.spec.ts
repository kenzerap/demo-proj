import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgFileCloudComponent } from './svg-file-cloud.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgFileCloudComponent', () => {
  let component: SvgFileCloudComponent;
  let fixture: ComponentFixture<SvgFileCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgFileCloudComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgFileCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
