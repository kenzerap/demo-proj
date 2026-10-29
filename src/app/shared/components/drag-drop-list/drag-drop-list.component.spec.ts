import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropListComponent } from './drag-drop-list.component';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DragDropListComponent', () => {
  let component: DragDropListComponent;
  let fixture: ComponentFixture<DragDropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropListComponent, MatIconModule, CdkDropList, CdkDrag],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DragDropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle drag-and-drop correctly', () => {
    // Mock input list
    component.listItem = [
      { id: 1, name: 'Item 1', isInclude: true, type: 'type' },
      { id: 2, name: 'Item 2', isInclude: true, type: 'type' },
      { id: 3, name: 'Item 3', isInclude: true, type: 'type' },
    ];

    // Spy on event emitters
    jest.spyOn(component.reOrderItems, 'emit');

    // Simulate drag-and-drop event
    const event: CdkDragDrop<TierSegmentIncludeExclude[]> = {
      previousIndex: 0,
      currentIndex: 2,
      item: {} as any,
      container: {} as any,
      previousContainer: {} as any,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 },
      dropPoint: { x: 0, y: 0 },
      event: new MouseEvent('drop'),
    };

    component.drop(event);

    // Expect list to be reordered
    expect(component.listItem).toEqual([
      { id: 2, name: 'Item 2', isInclude: true, type: 'type' },
      { id: 3, name: 'Item 3', isInclude: true, type: 'type' },
      { id: 1, name: 'Item 1', isInclude: true, type: 'type' },
    ]);

    // Expect reOrderItems event to be emitted
    expect(component.reOrderItems.emit).toHaveBeenCalledWith(
      component.listItem
    );
  });

  it('should remove item when isEditable is true', () => {
    component.isEditable = true;
    jest.spyOn(component.onRemoveItem, 'emit');

    const itemToRemove = { id: 2, name: 'Item 2' };
    component.removeItem(itemToRemove);

    expect(component.onRemoveItem.emit).toHaveBeenCalledWith(itemToRemove);
  });

  it('should not remove item when isEditable is false', () => {
    component.isEditable = false;
    jest.spyOn(component.onRemoveItem, 'emit');

    component.removeItem({ id: 2, name: 'Item 2' });

    expect(component.onRemoveItem.emit).not.toHaveBeenCalled();
  });
});
