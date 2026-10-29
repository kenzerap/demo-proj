import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDefaultUserComponent } from './svg-default-user.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgDefaultUserComponent', () => {
  let component: SvgDefaultUserComponent;
  let fixture: ComponentFixture<SvgDefaultUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgDefaultUserComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgDefaultUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
