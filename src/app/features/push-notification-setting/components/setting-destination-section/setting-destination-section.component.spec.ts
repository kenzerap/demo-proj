import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { SettingDestinationSectionComponent } from './setting-destination-section.component';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import { DestinationCode } from '@app/shared/constants/destination-options.const';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SettingDestinationSectionComponent', () => {
  let component: SettingDestinationSectionComponent;
  let fixture: ComponentFixture<SettingDestinationSectionComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SettingDestinationSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingDestinationSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    component.formGroup = new FormGroup({
      destination_type: new FormControl(),
      destination_value: new FormControl(),
    });

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getPrivileges on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      CreateEditPushNotificationActions.getPrivileges()
    );
  });

  it('should update privilegeOptions and patch destination_value in create mode', () => {
    component.isCreateMode = true;
    const privileges = [
      { privilegeName: 'Privilege 1', privilegeId: 1 },
      { privilegeName: 'Privilege 2', privilegeId: 2 },
    ];
    component.privileges$ = of(privileges);

    component.ngOnInit();

    expect(component.privilegeOptions).toEqual([
      { value: 'Privilege 1', code: '1' },
      { value: 'Privilege 2', code: '2' },
    ]);
    expect(component.destinationValueControl?.value).toBe('1');
  });

  it('should set validators and patch/reset destination_value based on destination_type changes', () => {
    const destinationTypeControl = component.destinationTypeControl!;
    const destinationValueControl = component.destinationValueControl!;

    // Case: DestinationCode.Privilege
    destinationTypeControl.setValue(DestinationCode.Privilege);
    expect(destinationValueControl.validator).toBeDefined();
    expect(destinationValueControl.value).toBe(undefined);

    // Case: DestinationCode.URL
    destinationTypeControl.setValue(DestinationCode.URL);
    expect(destinationValueControl.validator).toBeDefined();
    expect(destinationValueControl.value).toBe('');

    // Case: Other
    destinationTypeControl.setValue('other');
    expect(destinationValueControl.validator).toBeNull();
    expect(destinationValueControl.value).toBe('');
  });

  it('should return the correct dropdown value', () => {
    const dropdownOptions = [
      { value: 'Option 1', code: '1' },
      { value: 'Option 2', code: '2' },
    ];
    expect(component.getDropdownValue('1', dropdownOptions)).toBe('Option 1');
    expect(component.getDropdownValue('3', dropdownOptions)).toBe('');
  });
});
