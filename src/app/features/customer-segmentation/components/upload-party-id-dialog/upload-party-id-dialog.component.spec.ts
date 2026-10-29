import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of } from 'rxjs';
import { UploadPartyIdDialogComponent } from './upload-party-id-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UploadPartyIdDialogComponent', () => {
  let component: UploadPartyIdDialogComponent;
  let fixture: ComponentFixture<UploadPartyIdDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<UploadPartyIdDialogComponent>>;
  let actions$: ReplaySubject<any>;
  let store: MockStore;

  const mockDialogData = {
    inventoryData: {
      brand_id: 1,
    },
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<UploadPartyIdDialogComponent>>;

    actions$ = new ReplaySubject(1);

    await TestBed.configureTestingModule({
      imports: [
        UploadPartyIdDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        FormBuilder,
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadPartyIdDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
