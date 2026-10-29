import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EClaimSubmitComponent } from './e-claim-submit.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import * as eClaimSubmitActions from '../../stores/e-claim-submit/e-claim-submit.actions';
import { Policy } from '../../models/policy.model';
import { PolicyTypeCode } from '@app/shared/utils/enums/policy-type.enum';
import { ReviewImagesDialogComponent } from '../review-images-dialog/review-images-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EClaimSubmitComponent', () => {
  let component: EClaimSubmitComponent;
  let fixture: ComponentFixture<EClaimSubmitComponent>;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;
  const mockPolicy: Policy = {
    policy_id: 1,
    policy_no: 'P-12345',
    policy_status: 'Active',
    policy_holder: 'John Doe',
    system_id: PolicyTypeCode.GROUP,
    product_name: 'Health Insurance',
    client_cert_no: 'C-12345',
    insured_name: 'John Doe',
    premium_amount: 1000,
    sum_insured_amount: 50000,
    show_payment: true,
    paid_to_date: '2023-12-31',
    last_policy_status: 'Active',
  };

  beforeEach(async () => {
    dialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [EClaimSubmitComponent],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ party_id: '123' }),
            },
          },
        },
        { provide: MatDialog, useValue: dialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EClaimSubmitComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.policy = mockPolicy;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize partyId from route params', () => {
    expect(component.partyId()).toBe('123');
  });

  it('should dispatch getEClaimSubmits on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      eClaimSubmitActions.getEClaimSubmits({
        partyId: '123',
        policyId: 1,
        queryParams: { page: 0, size: 5 },
      })
    );
  });

  it('should update defaultParams and dispatch getEClaimSubmits on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(component.defaultParams()).toEqual({ page: 2, size: 5 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      eClaimSubmitActions.getEClaimSubmits({
        partyId: '123',
        policyId: 1,
        queryParams: { page: 2, size: 5 },
      })
    );
  });

  it('should update defaultParams and dispatch getEClaimSubmits on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(10);
    expect(component.defaultParams()).toEqual({ page: 0, size: 10 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      eClaimSubmitActions.getEClaimSubmits({
        partyId: '123',
        policyId: 1,
        queryParams: { page: 0, size: 10 },
      })
    );
  });

  it('should open the ReviewImagesDialog with correct data', () => {
    const mockEClaim = {
      receiptImages: ['receipt1.jpg'],
      medicalCertificates: ['certificate1.jpg'],
      otherDocuments: ['document1.jpg'],
    } as any;
    component.openReviewImagesDialog(mockEClaim, 'receiptImages');
    expect(dialog.open).toHaveBeenCalledWith(ReviewImagesDialogComponent, {
      data: {
        imageNames: ['receipt1.jpg'],
        partyId: '123',
        policyId: 1,
      },
      width: '30rem',
      height: '44rem',
      autoFocus: false,
    });
  });

  it('should return true for checkDisabled if column data is empty', () => {
    const mockEClaim = {
      receiptImages: [],
      medicalCertificates: [],
      otherDocuments: [],
    } as any;
    expect(component.checkDisabled(mockEClaim, 'receiptImages')).toBe(true);
    expect(component.checkDisabled(mockEClaim, 'medicalCertificates')).toBe(
      true
    );
    expect(component.checkDisabled(mockEClaim, 'otherDocuments')).toBe(true);
  });

  it('should return false for checkDisabled if column data is not empty', () => {
    const mockEClaim = {
      receiptImages: ['receipt1.jpg'],
      medicalCertificates: ['certificate1.jpg'],
      otherDocuments: ['document1.jpg'],
    } as any;
    expect(component.checkDisabled(mockEClaim, 'receiptImages')).toBe(false);
    expect(component.checkDisabled(mockEClaim, 'medicalCertificates')).toBe(
      false
    );
    expect(component.checkDisabled(mockEClaim, 'otherDocuments')).toBe(false);
  });

  it('should dispatch downloadImagesZip action on downloadZipFile', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const mockEClaim = {
      eclaimId: 1,
      receiptImages: ['receipt1.jpg'],
      medicalCertificates: ['certificate1.jpg'],
      otherDocuments: ['document1.jpg'],
    } as any;
    component.downloadZipFile(mockEClaim, 'receiptImages');
    expect(dispatchSpy).toHaveBeenCalledWith(
      eClaimSubmitActions.downloadImagesZip({
        eclaimId: 1,
        imageUrls: ['receipt1.jpg', 'certificate1.jpg', 'document1.jpg'],
        policyId: 1,
        partyId: '123',
      })
    );
  });
});
