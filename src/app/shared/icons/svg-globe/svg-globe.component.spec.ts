import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGlobeComponent } from './svg-globe.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgGlobeComponent', () => {
  let component: SvgGlobeComponent;
  let fixture: ComponentFixture<SvgGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgGlobeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
