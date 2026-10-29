import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TargetGroupIconComponent } from './target-group-icon.component';
import { TargetGroupType } from '../target-group-section/target-group-type.enum';
import { targetGroupList } from '../../constants/target-group-list.const';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TargetGroupIconComponent', () => {
  let component: TargetGroupIconComponent;
  let fixture: ComponentFixture<TargetGroupIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TargetGroupIconComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetGroupIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize targetGroups with targetGroupList', () => {
    expect(component.targetGroups()).toEqual(targetGroupList);
  });

  it('should set targetGroupControl value when changeGroup is called and control is enabled', () => {
    const testCode = TargetGroupType.PUBLIC;
    component.targetGroupControl.enable();
    component.changeGroup(testCode);
    expect(component.targetGroupControl.value).toBe(testCode);
  });

  it('should not set targetGroupControl value when changeGroup is called and control is disabled', () => {
    const testCode = TargetGroupType.PUBLIC;
    component.targetGroupControl.disable();
    component.changeGroup(testCode);
    expect(component.targetGroupControl.value).toBeNull();
  });
});
