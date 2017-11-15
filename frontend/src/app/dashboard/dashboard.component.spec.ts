import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {Component} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {MockComponent} from "ng2-mock-component";
import {MeetServiceSpy} from "../services/meet.service.spy";
import {RouterLinkStubDirective} from "../../testing/router-stubs";
import {MeetService} from "../services/meet.service";
import {SuiModule} from "ng2-semantic-ui";
import {FormsModule} from "@angular/forms";

@Component({
  template: ``
})
class CreateRoomComponentMock {}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let meetServiceSpy: MeetServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'room/create', component: CreateRoomComponentMock }
        ]),
        FormsModule,
        SuiModule
      ],
      declarations: [
        DashboardComponent,
        CreateRoomComponentMock,
        RouterLinkStubDirective,
        MockComponent({ selector: 'app-room-list', inputs: ['rooms', 'searchText', 'searchOption'] })
      ],
      providers: [
        { provide: MeetService, useClass: MeetServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    meetServiceSpy = fixture.debugElement.injector.get(MeetService) as any;
    localStorage.setItem('currentUser', '{"id": "1"}');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
