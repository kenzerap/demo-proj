import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGroupBgRedComponent } from './svg-group-bg-red.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgGroupBgRedComponent', () => {
  let component: SvgGroupBgRedComponent;
  let fixture: ComponentFixture<SvgGroupBgRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgGroupBgRedComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgGroupBgRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
