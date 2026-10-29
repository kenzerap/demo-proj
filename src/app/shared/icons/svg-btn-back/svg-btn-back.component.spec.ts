import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgBtnBackComponent } from './svg-btn-back.component';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgBtnBackComponent', () => {
  let component: SvgBtnBackComponent;
  let fixture: ComponentFixture<SvgBtnBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SvgBtnBackComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SvgBtnBackComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
    fixture = TestBed.createComponent(SvgBtnBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default color as black', () => {
    expect(component.color).toBe('black');
  });

  it('should accept a custom color input', () => {
    component.color = 'red';
    expect(component.color).toBe('red');
  });

  it('should render the path with the correct color', () => {
    component.color = 'blue';
    fixture.detectChanges();
    const svgElement: SVGElement = fixture.nativeElement.querySelector('path');
    expect(svgElement.getAttribute('fill')).toBe('blue');
  });
});
