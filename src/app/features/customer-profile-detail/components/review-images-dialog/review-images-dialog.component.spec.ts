import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewImagesDialogComponent } from './review-images-dialog.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as eClaimSubmitActions from '../../stores/e-claim-submit/e-claim-submit.actions';
import * as eClaimSubmitSelectors from '../../stores/e-claim-submit/e-claim-submit.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReviewImagesDialogComponent', () => {
  let component: ReviewImagesDialogComponent;
  let fixture: ComponentFixture<ReviewImagesDialogComponent>;
  let store: MockStore;
  const mockDialogData = {
    partyId: '12345',
    policyId: 67890,
    imageNames: ['image1.jpg', 'image2.jpg'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewImagesDialogComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector:
                eClaimSubmitSelectors.selectEClaimImageUrlsByPolicyId(67890),
              value: {
                presigned_urls: [
                  { presigned_url: 'https://example.com/image1.jpg' },
                  { presigned_url: 'https://example.com/image2.jpg' },
                ],
              },
            },
          ],
        }),
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewImagesDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getEClaimImageUrls on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      eClaimSubmitActions.getEClaimImageUrls({
        partyId: mockDialogData.partyId,
        policyId: mockDialogData.policyId,
        imageNames: mockDialogData.imageNames,
      })
    );
  });

  it('should dispatch resetEClaimImageUrls on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      eClaimSubmitActions.resetEClaimImageUrls()
    );
  });
});
