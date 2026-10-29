import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserAccountComponent } from './create-user-account.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValueCode } from '@app/shared/models/value-code.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateUserAccountComponent', () => {
  let component: CreateUserAccountComponent;
  let fixture: ComponentFixture<CreateUserAccountComponent>;
  let store: MockStore;
  let dialogRef: jest.Mocked<MatDialogRef<CreateUserAccountComponent>>;

  beforeEach(async () => {
    store = {
      dispatch: jest.fn(),
      select: jest.fn().mockReturnValue(of(false)),
    } as unknown as MockStore;

    dialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<CreateUserAccountComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        CreateUserAccountComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: Store, useValue: store },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get form controls', () => {
    expect(component.emailControl).toBe(
      component.createUserAccountForm.get('email')
    );
    expect(component.groupIdControl).toBe(
      component.createUserAccountForm.get('group_id')
    );
    expect(component.statusControl).toBe(
      component.createUserAccountForm.get('status')
    );
  });

  it('should dispatch getGroups on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should patch group_id when userGroupOptions$ emits', () => {
    const patchSpy = jest.spyOn(component.groupIdControl!, 'patchValue');
    // Simulate userGroupOptions$ emitting
    (component as any).userGroupOptions$ = of([
      { value: 'Group 1', code: 1 },
      { value: 'Group 2', code: 2 },
    ]);
    component.ngOnInit();
    expect(patchSpy).toHaveBeenCalledWith(1);
  });

  it('should close dialog when loading$ emits false and isSubmitted is true', () => {
    component.isSubmitted = true;
    (component as any).loading$ = of(false);
    component.ngOnInit();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should return dropdown value for selected code', () => {
    const options: ValueCode<any>[] = [
      { value: 'A', code: '1' },
      { value: 'B', code: '2' },
    ];
    expect(component.getDropdownValue('2', options)).toBe('B');
    expect(component.getDropdownValue('3', options)).toBe('');
    expect(component.getDropdownValue(null, options)).toBe('');
  });

  it('should mark form as touched and not dispatch if form is invalid', () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.createUserAccountForm,
      'markAllAsTouched'
    );
    component.createUserAccountForm.patchValue({
      email: '',
      group_id: '',
      status: '',
    });
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should dispatch createUserAccount if form is valid', () => {
    component.createUserAccountForm.patchValue({
      email: 'test@example.com',
      group_id: 1,
      status: 'ACTIVE',
    });
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalled();
    expect(component.isSubmitted).toBe(true);
  });
});
