import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgMobileAnnouncementComponent } from './svg-mobile-announcement.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgMobileAnnouncementComponent', () => {
  let component: SvgMobileAnnouncementComponent;
  let fixture: ComponentFixture<SvgMobileAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgMobileAnnouncementComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgMobileAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
