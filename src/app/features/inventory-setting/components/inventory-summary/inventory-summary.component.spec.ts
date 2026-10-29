import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySummaryComponent } from './inventory-summary.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InventorySummaryComponent', () => {
  let component: InventorySummaryComponent;
  let fixture: ComponentFixture<InventorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySummaryComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
