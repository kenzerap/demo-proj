import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileAnnouncementPreviewComponent } from './mobile-announcement-preview.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as CreateEditPopupAnnouncementActions from '../../stores/create-edit-popup-announcement/create-edit-popup-announcement.actions';
import * as CreateEditPopupAnnouncementSelectors from '../../stores/create-edit-popup-announcement/create-edit-popup-announcement.selectors';
import * as PopupAnnouncementActions from '../../stores/popup-announcement/popup-announcement.actions';
import { PreviewImage } from '../../models/preview-image.model';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MobileAnnouncementPreviewComponent', () => {
  let component: MobileAnnouncementPreviewComponent;
  let fixture: ComponentFixture<MobileAnnouncementPreviewComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAnnouncementPreviewComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileAnnouncementPreviewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Mock selectors
    store.overrideSelector(
      CreateEditPopupAnnouncementSelectors.selectTargetGroupUserSummary,
      {
        percentage: 50,
        count: 100,
        name: 'Test Group',
        target_group_id: [],
      } as TargetGroupsUserSummary
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getTargetGroupUserSummary when targetGroupId is set', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.targetGroupId = 123;
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPopupAnnouncementActions.getTargetGroupUserSummary({
        target_group_id: 123,
      })
    );
  });

  it('should return the correct targetGroupId', () => {
    component.targetGroupId = 456;
    expect(component.targetGroupId).toBe(456);
  });

  it('should select targetGroupUserSummary$ from the store', (done) => {
    component.targetGroupUserSummary$.subscribe((summary) => {
      expect(summary).toEqual({
        percentage: 50,
        count: 100,
        name: 'Test Group',
        target_group_id: [],
      });
      done();
    });
  });

  it('should dispatch resetPreviewImages on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      PopupAnnouncementActions.resetPreviewImages()
    );
  });

  it('should handle images input correctly', () => {
    const mockImages: PreviewImage[] = [
      { image: 'image1.jpg', imageData: null },
      { image: 'image2.jpg', imageData: null },
    ];
    component.images = mockImages;
    expect(component.images).toEqual(mockImages);
  });

  it('should handle dontShowButton input correctly', () => {
    component.dontShowButton = true;
    expect(component.dontShowButton).toBe(true);
  });

  it('should handle showSummary input correctly', () => {
    component.showSummary = true;
    expect(component.showSummary).toBe(true);
  });
});
