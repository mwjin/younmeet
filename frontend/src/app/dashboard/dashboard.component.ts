import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room';
import { MeetService } from '../services/meet.service';

@Component({
  selector : 'app-dashboard',
  templateUrl : './dashboard.component.html',
  styles : []
})
export class DashboardComponent implements OnInit {

  roomsCreated: Room[];
  roomsJoined: Room[];

  constructor(private meetService: MeetService) { }

  ngOnInit() {
    this.meetService.getRoomsCreatedByMe().then(
      rooms => this.roomsCreated = rooms
    );
    this.meetService.getRoomsJoinedByMe().then(
      rooms => this.roomsJoined = rooms
    );
  }

}
