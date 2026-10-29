import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgMobileNotificationComponent } from './svg-mobile-notification.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgMobileNotificationComponent', () => {
  let component: SvgMobileNotificationComponent;
  let fixture: ComponentFixture<SvgMobileNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgMobileNotificationComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgMobileNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
