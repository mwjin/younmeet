import { Component, OnInit } from '@angular/core';
import { MeetService } from '../services/meet.service';
import { Router } from '@angular/router';
import { CreateRoomForm } from './create-room-form';

@Component({
  selector : 'app-create-room',
  templateUrl : './create-room.component.html',
  styles : []
})
export class CreateRoomComponent implements OnInit {
  formModel = new CreateRoomForm();

  constructor(private meetService: MeetService,
              private router: Router) {}

  ngOnInit() {
  }

  onSubmit(): void {
    this.meetService.addRoom(this.formModel)
      .then(room => {
        // navigate to room detail page
        this.router.navigate(['room', room.id, 'place']);
    });
  }
}
