import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MeetService} from "../services/meet.service";
import {Room} from "../models/room";
import {Timespan} from "../models/timespan";
import {Router} from "@angular/router";

class CreateRoomForm {
  constructor(public name: string = '',
              public duration: number = 30,
              public timespan: Timespan = new Timespan(),
              public anonymity: boolean = false) {}

  toRoom(): Room {
    let room = new Room(this.name, this.duration, this.timespan, this.anonymity);
    return room;
  }
}

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styles: []
})
export class CreateRoomComponent implements OnInit {
  formModel = new CreateRoomForm();

  constructor(private meetService: MeetService,
              private router: Router) {}

  ngOnInit() {
  }

  onSubmit(): void {
    let room = this.formModel.toRoom();
    console.log('you submitted ', room);
    this.meetService.addRoom(this.formModel.toRoom())
      .then(room => {
        // navigate to room detail page
        this.router.navigate(['room', room.id])
    });
  }
}
