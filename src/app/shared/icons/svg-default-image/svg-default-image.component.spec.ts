import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDefaultImageComponent } from './svg-default-image.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgDefaultImageComponent', () => {
  let component: SvgDefaultImageComponent;
  let fixture: ComponentFixture<SvgDefaultImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgDefaultImageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgDefaultImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
