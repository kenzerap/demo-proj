import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGiftBoxComponent } from './svg-gift-box.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgGiftBoxComponent', () => {
  let component: SvgGiftBoxComponent;
  let fixture: ComponentFixture<SvgGiftBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgGiftBoxComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgGiftBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
