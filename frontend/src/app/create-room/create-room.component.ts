import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

class Timespan {
  constructor(public start: Date,
              public end: Date) {}
}
class CreateRoomForm {
  constructor(public name: string = '',
              public duration: number = 0,
              public timespan: Timespan = new Timespan(null, null),
              public anonymity: boolean = false) {}
}
@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styles: []
})
export class CreateRoomComponent implements OnInit {
  formModel = new CreateRoomForm();

  ngOnInit() {
  }

  onSubmit(): void {
    console.log('you submitted ', this.formModel)
  }
}
