import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgRefreshComponent } from './svg-refresh.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgRefreshComponent', () => {
  let component: SvgRefreshComponent;
  let fixture: ComponentFixture<SvgRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgRefreshComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
