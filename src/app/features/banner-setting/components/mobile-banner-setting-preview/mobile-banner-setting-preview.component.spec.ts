import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileBannerSettingPreviewComponent } from './mobile-banner-setting-preview.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as CreateEditBannerSettingActions from '../../stores/create-edit-banner-setting/create-edit-banner-setting.actions';
import * as CreateEditBannerSettingSelectors from '../../stores/create-edit-banner-setting/create-edit-banner-setting.selectors';
import * as BannerSettingActions from '../../stores/banner-setting/banner-setting.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MobileBannerSettingPreviewComponent', () => {
  let component: MobileBannerSettingPreviewComponent;
  let fixture: ComponentFixture<MobileBannerSettingPreviewComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBannerSettingPreviewComponent, NoopAnimationsModule],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileBannerSettingPreviewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Mock selectors
    store.overrideSelector(
      CreateEditBannerSettingSelectors.selectTargetGroupUserSummary,
      { percentage: 50, count: 100, name: 'Test Group', target_group_id: [1] }
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getTargetGroupUserSummary when targetGroupId is set', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.targetGroupId = 123;
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditBannerSettingActions.getTargetGroupUserSummary({
        target_group_id: 123,
      })
    );
  });

  it('should return the correct targetGroupId', () => {
    component.targetGroupId = 456;
    expect(component.targetGroupId).toBe(456);
  });

  it('should select targetGroupUserSummary from the store', (done) => {
    component.targetGroupUserSummary$.subscribe((summary) => {
      expect(summary).toEqual({
        percentage: 50,
        count: 100,
        name: 'Test Group',
        target_group_id: [1],
      });
      done();
    });
  });

  it('should dispatch resetPreviewImages on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.resetPreviewImages()
    );
  });

  it('should handle empty images input', () => {
    component.images = [];
    expect(component.images).toEqual([]);
  });

  it('should handle showSummary input', () => {
    component.showSummary = true;
    expect(component.showSummary).toBe(true);
  });
});
