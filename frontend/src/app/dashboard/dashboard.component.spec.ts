import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {Component} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {MockComponent} from "ng2-mock-component";

@Component({
  template: ``
})
class CreateRoomComponentMock {}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '/room/create', component: CreateRoomComponentMock }
        ]),
      ],
      declarations: [
        DashboardComponent,
        CreateRoomComponentMock,
        MockComponent({ selector: 'app-room-list' })
      ],
      providers: [

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
