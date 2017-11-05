import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room';
import { MeetService } from '../services/meet.service';
import {User} from "../models/user";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector : 'app-dashboard',
  templateUrl : './dashboard.component.html',
  styles : []
})
export class DashboardComponent implements OnInit {

  user: User;

  roomsCreated_Urgent: Room[];
  roomsCreated_NotUrgent: Room[];
  roomsJoined_Urgent: Room[];
  roomsJoined_NotUrgent: Room[];

  constructor(private meetService: MeetService) {
    let userData = localStorage.getItem('currentUser');
    if (userData) {
      this.user = JSON.parse(userData) as User;
      this.meetService.getRoomsCreatedByMe(this.user.id).then(rooms => {
        this.roomsCreated_Urgent = rooms.filter(room => room.urgent);
        this.roomsCreated_NotUrgent = rooms.filter(room => !room.urgent);
      });
      this.meetService.getRoomsJoinedByMe(this.user.id).then(rooms => {
        this.roomsJoined_Urgent = rooms.filter(room => room.urgent);
        this.roomsJoined_NotUrgent = rooms.filter(room => !room.urgent);
      });
    }
    else {
      console.log('error: field currentUser does not exist in localStorage');
    }
  }

  ngOnInit() {
  }
}
