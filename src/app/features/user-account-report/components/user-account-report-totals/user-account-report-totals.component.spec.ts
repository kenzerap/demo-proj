import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { UserAccountReportTotalsComponent } from './user-account-report-totals.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserAccountReportTotalsComponent', () => {
  let component: UserAccountReportTotalsComponent;
  let fixture: ComponentFixture<UserAccountReportTotalsComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountReportTotalsComponent, NoopAnimationsModule],
      providers: [provideMockStore({}), provideNativeDateAdapter()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountReportTotalsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
