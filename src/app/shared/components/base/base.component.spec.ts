import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponent } from './base.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroy$ when ngOnDestroy is called', () => {
    jest.spyOn(component.destroy$, 'next');
    jest.spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(component.destroy$.next).toHaveBeenCalledTimes(1);
    expect(component.destroy$.complete).toHaveBeenCalledTimes(1);
  });
});
