import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingListComponent } from './account-setting-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AccountSettingListComponent', () => {
  let component: AccountSettingListComponent;
  let fixture: ComponentFixture<AccountSettingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingListComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
