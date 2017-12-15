import { Component, OnInit } from '@angular/core';
import { MeetService } from '../services/meet.service';
import { Router } from '@angular/router';
import { CreateRoomForm } from './create-room-form';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timespan } from '../models/timespan';


function roomCreateValidator(control: AbstractControl) {
  const name: string = control.get('name').value;
  const duration: number = control.get('duration').value;
  const minPeople: number = control.get('minPeople').value;
  const timeSpanStart: Date = control.get('timeSpanStart').value;
  const timeSpanEnd: Date = control.get('timeSpanEnd').value;

  if (name.length === 0) {
    // name should not be empty
    control.get('name').setErrors({ invalidName : true });
  }

  if (!duration) {
    control.get('duration').setErrors({ invalidDurationForm : true });
  }

  if (duration < 0 || duration > Number.MAX_SAFE_INTEGER) {
    control.get('duration').setErrors({ invalidDurationRange : true });
  }

  if (duration % 1 !== 0) {
    // floating point
    control.get('duration').setErrors({ invalidDurationFloat : true });
  }

  if (!minPeople) {
    control.get('minPeople').setErrors({ invalidMinPeopleForm : true });
  }

  if (minPeople < 0 || minPeople > Number.MAX_SAFE_INTEGER) {
    control.get('minPeople').setErrors({ invalidMinPeopleRange : true });
  }

  if (minPeople % 1 !== 0) {
    control.get('minPeople').setErrors({ invalidMinPeopleFloat : true });
  }

  const current: Date = new Date();
  const currentDate: Date = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
  if (timeSpanStart <= currentDate) {
    control.get('timeSpanStart').setErrors({ invalidTimeSpanStartPast : true });
  }

  if (timeSpanEnd <= currentDate) {
    control.get('timeSpanEnd').setErrors({ invalidTimeSpanEndPast : true });
  }
}

@Component({
  selector : 'app-create-room',
  templateUrl : './create-room.component.html',
  styleUrls : [ './create-room.component.css' ]
})
export class CreateRoomComponent implements OnInit {
  formModel: CreateRoomForm;
  createRoomForm: FormGroup;

  constructor(private meetService: MeetService,
              private router: Router,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createRoomForm = this.formBuilder.group({
      'name' : [ '', Validators.required ],
      'duration' : [ 30, Validators.required ],
      'minPeople' : [ 1, Validators.required ],
      'timeSpanStart' : [ new Date(), Validators.required ],
      'timeSpanEnd' : [ new Date(), Validators.required ],
      'anonymity' : [ false, ],
    }, {
      validator : roomCreateValidator
    });
  }

  onSubmit(): void {
    this.formModel = new CreateRoomForm(
      this.createRoomForm.get('name').value,
      this.createRoomForm.get('duration').value,
      this.createRoomForm.get('minPeople').value,
      new Timespan(this.createRoomForm.get('timeSpanStart').value,
        this.createRoomForm.get('timeSpanEnd').value),
      this.createRoomForm.get('anonymity').value
    );
    console.log(this.formModel.timeSpan.start);
    console.log(this.formModel.timeSpan.end);
    this.meetService.addRoom(this.formModel)
      .then(room => {
        // navigate to room detail page
        this.router.navigate([ 'room', room.hashid, 'place' ]);
      });
  }
}
