import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgUserComponent } from './svg-user.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgDefaultUserComponent', () => {
  let component: SvgUserComponent;
  let fixture: ComponentFixture<SvgUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgUserComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
