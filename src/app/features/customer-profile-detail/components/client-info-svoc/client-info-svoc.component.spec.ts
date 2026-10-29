import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientInfoSvocComponent } from './client-info-svoc.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ClientInfoSvocComponent', () => {
  let component: ClientInfoSvocComponent;
  let fixture: ComponentFixture<ClientInfoSvocComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInfoSvocComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientInfoSvocComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
