import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChannelSectionComponent } from './channel-section.component';
import * as CreateEditFundTypeSelectors from '../../stores/create-edit-fund-type/create-edit-fund-type.selectors';
import { FundType } from '../../models/fund-type.model';

describe('ChannelSectionComponent', () => {
  let component: ChannelSectionComponent;
  let fixture: ComponentFixture<ChannelSectionComponent>;
  let formBuilder: FormBuilder;

  const rawChannelOptions = [
    { channel_id: 1, channel_code: 'AGT', name_th: 'ตัวแทน', name_en: 'Agent' },
    { channel_id: 2, channel_code: 'ONL', name_th: 'ออนไลน์', name_en: 'Online' },
  ];

  function createComponent(
    options: {
      formMode?: 'create' | 'edit' | 'view';
      fundTypeDetail?: Partial<FundType> | null;
      channelOptionsValue?: typeof rawChannelOptions;
    } = {},
  ) {
    TestBed.configureTestingModule({
      imports: [
        ChannelSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [
            {
              selector: CreateEditFundTypeSelectors.selectChannelOptions,
              value: options.channelOptionsValue ?? rawChannelOptions,
            },
            {
              selector: CreateEditFundTypeSelectors.selectFundTypeDetail,
              value: options.fundTypeDetail ?? null,
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ChannelSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      channels: formBuilder.array([
        formBuilder.group({
          channel: ['', Validators.required],
          visible: [true],
        }),
      ]),
    });
    component.formMode = options.formMode ?? 'create';
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('basic behaviour', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should get channelsFormArray', () => {
      expect(component.channelsFormArray).toBeInstanceOf(FormArray);
      expect(component.channelsFormArray).toBe(
        component.formGroup.get('channels'),
      );
    });

    describe('getDropdownValue', () => {
      it('should return the matching value for a known code', () => {
        const options = [
          { code: 1, value: 'Online' },
          { code: 2, value: 'Branch' },
        ];

        expect(component.getDropdownValue(1, options)).toBe('Online');
      });

      it('should return empty string for an unknown or null code', () => {
        const options = [{ code: 1, value: 'Online' }];

        expect(component.getDropdownValue(99, options)).toBe('');
        expect(component.getDropdownValue(null, options)).toBe('');
      });
    });

    describe('channelOptions$', () => {
      it('should map the raw channel options from the store into ValueCode form', () => {
        let result: unknown;
        const subscription = component.channelOptions$.subscribe(
          (options) => (result = options),
        );

        expect(result).toEqual([
          { value: 'Agent', code: 1 },
          { value: 'Online', code: 2 },
        ]);
        subscription.unsubscribe();
      });
    });

    describe('addChannel', () => {
      it('should add a new row defaulted to the first loaded channel option and visible', () => {
        const initialLength = component.channelsFormArray.length;

        component.addChannel();

        expect(component.channelsFormArray.length).toBe(initialLength + 1);
        const newRow = component.channelsFormArray.at(initialLength);
        expect(newRow.get('channel')?.value).toBe(1);
        expect(newRow.get('visible')?.value).toBe(true);
      });

      it('should add a row pre-filled with the provided value', () => {
        component.addChannel({ channel: 2, visible: false });

        const newRow = component.channelsFormArray.at(
          component.channelsFormArray.length - 1,
        );
        expect(newRow.get('channel')?.value).toBe(2);
        expect(newRow.get('visible')?.value).toBe(false);
      });
    });

    describe('removeChannel', () => {
      it('should remove the row at the given index', () => {
        component.addChannel({ channel: 1, visible: false });
        const initialLength = component.channelsFormArray.length;

        component.removeChannel(0);

        expect(component.channelsFormArray.length).toBe(initialLength - 1);
      });
    });

    it('should reflect the assigned formMode', () => {
      component.formMode = 'view';
      expect(component.formMode).toBe('view');
    });
  });

  describe('ngOnInit', () => {
    it('should default the existing row channel to the first option once channel options load in create mode', () => {
      createComponent({ formMode: 'create' });
      fixture.detectChanges();

      expect(component.channelsFormArray.at(0).get('channel')?.value).toBe(1);
    });

    it('should not touch existing rows while channel options have not loaded yet', () => {
      createComponent({ formMode: 'create', channelOptionsValue: [] });
      fixture.detectChanges();

      expect(component.channelsFormArray.at(0).get('channel')?.value).toBe(
        '',
      );
    });

    it('should rebuild rows from fundTypeDetail when formMode is edit', () => {
      const fundTypeDetail: Partial<FundType> = {
        channels: [{ channel_id: 2, visible: false }],
      };
      createComponent({ formMode: 'edit', fundTypeDetail });
      fixture.detectChanges();

      expect(component.channelsFormArray.length).toBe(1);
      expect(component.channelsFormArray.at(0).get('channel')?.value).toBe(
        2,
      );
      expect(component.channelsFormArray.at(0).get('visible')?.value).toBe(
        false,
      );
    });

    it('should disable the form group when formMode is view', () => {
      const fundTypeDetail: Partial<FundType> = {
        channels: [{ channel_id: 1, visible: true }],
      };
      createComponent({ formMode: 'view', fundTypeDetail });
      fixture.detectChanges();

      expect(component.formGroup.disabled).toBe(true);
    });

    it('should leave rows untouched when formMode is edit but fundTypeDetail is not yet loaded', () => {
      createComponent({ formMode: 'edit', fundTypeDetail: null });
      fixture.detectChanges();

      expect(component.channelsFormArray.length).toBe(1);
      expect(component.channelsFormArray.at(0).get('channel')?.value).toBe(
        '',
      );
    });

    it('should clear all rows when fundTypeDetail has no channels', () => {
      createComponent({ formMode: 'edit', fundTypeDetail: {} });
      fixture.detectChanges();

      expect(component.channelsFormArray.length).toBe(0);
    });
  });

  describe('addChannel before options load', () => {
    it('should default the channel to an empty string when no options have loaded yet', () => {
      createComponent({ formMode: 'edit', channelOptionsValue: [] });
      fixture.detectChanges();

      component.addChannel();

      const newRow = component.channelsFormArray.at(
        component.channelsFormArray.length - 1,
      );
      expect(newRow.get('channel')?.value).toBe('');
    });
  });
});
