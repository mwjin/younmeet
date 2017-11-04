import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room';
import { MeetService } from '../services/meet.service';

@Component({
  selector : 'app-dashboard',
  templateUrl : './dashboard.component.html',
  styles : []
})
export class DashboardComponent implements OnInit {

  roomsCreated_Urgent: Room[];
  roomsCreated_NotUrgent: Room[];
  roomsJoined_Urgent: Room[];
  roomsJoined_NotUrgent: Room[];

  constructor(private meetService: MeetService) { }

  ngOnInit() {
    this.meetService.getRoomsCreatedByMe().then(rooms => {
      this.roomsCreated_Urgent = rooms.filter(room => room.urgent);
      this.roomsCreated_NotUrgent = rooms.filter(room => !room.urgent);
    });
    this.meetService.getRoomsJoinedByMe().then(rooms => {
      this.roomsJoined_Urgent = rooms.filter(room => room.urgent);
      this.roomsJoined_NotUrgent = rooms.filter(room => !room.urgent);
    });
  }

}
