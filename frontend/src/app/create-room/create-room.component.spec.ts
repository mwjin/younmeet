import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { CreateRoomComponent } from './create-room.component';
import {MeetServiceSpy} from "../services/meet.service.spy";
import {RouterTestingModule} from "@angular/router/testing";
import {Component} from "@angular/core";
import {SuiModule} from "ng2-semantic-ui";
import {RouterLinkStubDirective} from "../../testing/router-stubs";
import {MeetService} from "../services/meet.service";
import {FormsModule} from "@angular/forms";
import { Timespan } from '../models/timespan';
import {Location} from '@angular/common';
import { CreateRoomForm } from './create-room-form';

@Component({
  template: ``
})
class PlaceComponenet {}

describe('CreateRoomComponent', () => {
  let component: CreateRoomComponent;
  let fixture: ComponentFixture<CreateRoomComponent>;
  let meetServiceSpy: MeetServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'room/:id/place', component: PlaceComponenet }
        ]),
        FormsModule,
        SuiModule
      ],
      declarations: [
        CreateRoomComponent,
        PlaceComponenet,
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
    component.formModel.name = 'Room Name';
    component.formModel.duration = 30;
    component.formModel.timespan = new Timespan(new Date(2017,11,15,0,0), new Date(2017,11,15,1,0));
    component.formModel.anonymity = false;

    meetServiceSpy = fixture.debugElement.injector.get(MeetService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should submit the new room data and redirect to room detail page',
        async(inject([Location], (location: Location) => {
      component.onSubmit();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        let roomArg: CreateRoomForm = meetServiceSpy.addRoom.calls.argsFor(0)[0];
        expect(roomArg.name).toEqual('Room Name');
        expect(roomArg.duration).toEqual(30);
        expect(roomArg.timespan).toEqual(new Timespan(new Date(2017,11,15,0,0), new Date(2017,11,15,1,0)));
        expect(roomArg.anonymity).toEqual(false);
        expect(location.path()).toMatch(/\/room\/\d+\/place/);
      });
    })));
  });
});
