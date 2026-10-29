import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgUsersComponent } from './svg-users.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgUsersComponent', () => {
  let component: SvgUsersComponent;
  let fixture: ComponentFixture<SvgUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgUsersComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
