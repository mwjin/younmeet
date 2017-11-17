import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomComponent } from './create-room.component';
import {MeetServiceSpy} from "../services/meet.service.spy";
import {RouterTestingModule} from "@angular/router/testing";
import {Component} from "@angular/core";
import {SuiModule} from "ng2-semantic-ui";
import {RouterLinkStubDirective} from "../../testing/router-stubs";
import {MeetService} from "../services/meet.service";
import {FormsModule} from "@angular/forms";

@Component({
  template: ``
})
class RoomDetailComponentMock {}

describe('CreateRoomComponent', () => {
  let component: CreateRoomComponent;
  let fixture: ComponentFixture<CreateRoomComponent>;
  let meetServiceSpy: MeetServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'room/:id', component: RoomDetailComponentMock }
        ]),
        FormsModule,
        SuiModule
      ],
      declarations: [
        CreateRoomComponent,
        RoomDetailComponentMock,
        RouterLinkStubDirective,
      ],
      providers: [
        { provide: MeetService, useClass: MeetServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomComponent);
    component = fixture.componentInstance;
    meetServiceSpy = fixture.debugElement.injector.get(MeetService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
