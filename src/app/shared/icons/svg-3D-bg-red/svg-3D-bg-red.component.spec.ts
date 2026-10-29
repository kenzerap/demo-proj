import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Svg3DBgRedComponent } from './svg-3D-bg-red.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Svg3DBgRedComponent', () => {
  let component: Svg3DBgRedComponent;
  let fixture: ComponentFixture<Svg3DBgRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Svg3DBgRedComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Svg3DBgRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
