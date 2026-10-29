import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSaveFileComponent } from './svg-save-file.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgSaveFileComponent', () => {
  let component: SvgSaveFileComponent;
  let fixture: ComponentFixture<SvgSaveFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgSaveFileComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgSaveFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
