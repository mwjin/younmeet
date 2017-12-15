import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserNotAllowedComponent } from './non-user-not-allowed.component';
import { SuiModule } from 'ng2-semantic-ui';
import {RouterTestingModule} from "@angular/router/testing";

describe('NonUserNotAllowedComponent', () => {
  let component: NonUserNotAllowedComponent;
  let fixture: ComponentFixture<NonUserNotAllowedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SuiModule,
        RouterTestingModule,
      ],
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
