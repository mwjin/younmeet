import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MeetService} from "../services/meet.service";
import {Room} from "../models/room";
import {Timespan} from "../models/timespan";

class CreateRoomForm {
  constructor(public name: string = '',
              public duration: number = 0,
              public timespan: Timespan = new Timespan(null, null),
              public anonymity: boolean = false) {}

  toRoom(): Room {
    return new Room(this.name, this.duration, this.timespan, this.anonymity);
  }
}

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styles: []
})
export class CreateRoomComponent implements OnInit {
  formModel = new CreateRoomForm();

  constructor(private meetService: MeetService) {}

  ngOnInit() {
  }

  onSubmit(): void {
    let room = this.formModel.toRoom();
    this.meetService.addRoom(this.formModel.toRoom());
    console.log('you submitted ', room);
  }
}
