import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleWithIconsComponent } from './title-with-icons.component';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TitleWithIconsComponent', () => {
  let component: TitleWithIconsComponent;
  let fixture: ComponentFixture<TitleWithIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleWithIconsComponent, MatIconModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleWithIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit itemClicked when onClickItem is called', () => {
    jest.spyOn(component.itemClicked, 'emit');
    component.onClickItem();
    expect(component.itemClicked.emit).toHaveBeenCalled();
  });
});
