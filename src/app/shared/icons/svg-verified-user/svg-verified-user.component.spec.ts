import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgVerifiedUserComponent } from './svg-verified-user.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgVerifiedUserComponent', () => {
  let component: SvgVerifiedUserComponent;
  let fixture: ComponentFixture<SvgVerifiedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgVerifiedUserComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgVerifiedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
