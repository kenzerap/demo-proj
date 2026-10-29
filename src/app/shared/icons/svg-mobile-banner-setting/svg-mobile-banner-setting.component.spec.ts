import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgMobileBannerSettingComponent } from './svg-mobile-banner-setting.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgMobileBannerSettingComponent', () => {
  let component: SvgMobileBannerSettingComponent;
  let fixture: ComponentFixture<SvgMobileBannerSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgMobileBannerSettingComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgMobileBannerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
