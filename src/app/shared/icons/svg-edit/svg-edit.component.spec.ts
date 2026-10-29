import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEditComponent } from './svg-edit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgEditComponent', () => {
  let component: SvgEditComponent;
  let fixture: ComponentFixture<SvgEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgEditComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
