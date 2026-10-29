import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPolicyComponent } from './add-policy.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as ExcludePointByPolicyNoActions from '../../stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AddPolicyComponent', () => {
  let component: AddPolicyComponent;
  let fixture: ComponentFixture<AddPolicyComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPolicyComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPolicyComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise addPolicyForm with empty policyNo', () => {
    expect(component.addPolicyForm.value).toEqual({ policyNo: '' });
  });

  it('should dispatch addPolicyToExcludePoint with trimmed policyNo on onAdd', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.addPolicyForm.setValue({ policyNo: '  ABC123  ' });

    component.onAdd();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.addPolicyToExcludePoint({
        policy_no: 'ABC123',
      }),
    );
  });

  it('should dispatch addPolicyToExcludePoint with empty string when policyNo is null', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.addPolicyForm.setValue({ policyNo: null });

    component.onAdd();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.addPolicyToExcludePoint({
        policy_no: '',
      }),
    );
  });

  it('should expose loading$ from the store', (done) => {
    store.setState({
      loadingContainer: { isLoading: { addPolicyToExcludePoint: true } },
    });

    component.loading$.subscribe((isLoading) => {
      expect(isLoading).toBe(true);
      done();
    });
  });
});
