import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgTicketComponent } from './svg-ticket.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgTicketComponent', () => {
  let component: SvgTicketComponent;
  let fixture: ComponentFixture<SvgTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgTicketComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
