import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeEngagementComponent } from './privilege-engagement.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrivilegeEngagementComponent', () => {
  let component: PrivilegeEngagementComponent;
  let fixture: ComponentFixture<PrivilegeEngagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivilegeEngagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
