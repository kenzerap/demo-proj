import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustSegmentSummaryConditionSectionComponent } from './cust-segment-summary-condition-section.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import * as CustomerSegmentationActions from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import * as CustomerSegmentationSelectors from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SegmentSummaryUser } from '@app/shared/models/segment-summary-user.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustSegmentSummaryConditionSectionComponent', () => {
  let component: CustSegmentSummaryConditionSectionComponent;
  let fixture: ComponentFixture<CustSegmentSummaryConditionSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CustSegmentSummaryConditionSectionComponent,
        NoopAnimationsModule
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      CustSegmentSummaryConditionSectionComponent
    );
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Mock selectors
    store.overrideSelector(
      CustomerSegmentationSelectors.selectSegmentSummaryUserById(1),
      { id: 1, name: 'Test User' } as SegmentSummaryUser
    );

    component.formGroup = formBuilder.group({});
    component.segmentGroupForm = formBuilder.group({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getSegmentSummaryUsers on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationActions.getSegmentSummaryUsers()
    );
  });

  it('should set and get targetGroupId', () => {
    component.targetGroupId = 123;
    expect(component.targetGroupId).toBe(123);
    expect(component.segmentSummaryUsers$).toBeDefined();
  });

  it('should override ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
