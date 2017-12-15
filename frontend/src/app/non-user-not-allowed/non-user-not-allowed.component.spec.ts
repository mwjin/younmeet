import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserNotAllowedComponent } from './non-user-not-allowed.component';

describe('NonUserNotAllowedComponent', () => {
  let component: NonUserNotAllowedComponent;
  let fixture: ComponentFixture<NonUserNotAllowedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonUserNotAllowedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonUserNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
