import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserLoginComponent } from './non-user-login.component';

describe('NonUserLoginComponent', () => {
  let component: NonUserLoginComponent;
  let fixture: ComponentFixture<NonUserLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonUserLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonUserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
