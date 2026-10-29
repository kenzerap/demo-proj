import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { ScannedActionsSubject } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let actions$: ReplaySubject<any> = new ReplaySubject(1);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, CommonModule, RouterOutlet],
      providers: [
        {
          provide: Router,
        },
        provideRouter([]),
        provideMockActions(() => actions$),
        {
          provide: ScannedActionsSubject,
          useValue: new ScannedActionsSubject(),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
