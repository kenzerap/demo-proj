import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataComponent } from './no-data.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NoDataComponent', () => {
  let component: NoDataComponent;
  let fixture: ComponentFixture<NoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoDataComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
