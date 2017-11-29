import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room';
import { MeetService } from '../services/meet.service';
import {User} from "../models/user";
import {FilterOptions} from "./room-list-filter.pipe";

@Component({
  selector : 'app-dashboard',
  templateUrl : './dashboard.component.html',
  styles : []
})
export class DashboardComponent implements OnInit {

  public user: User;
  public  roomsCreated_Urgent: Room[];
  public roomsCreated_NotUrgent: Room[];
  public roomsJoined_Urgent: Room[];
  public roomsJoined_NotUrgent: Room[];
  public latitude: number;
  public longitude: number;
  public zoom: number;


  private filters: FilterOptions[] = ["All", "Name", "Location"];

  private searchText: string;

  private currentSearchOption: FilterOptions = "All";

  constructor(private meetService: MeetService) {
    this.meetService.getRoomsCreatedByMe().then(rooms => {
      this.roomsCreated_Urgent = rooms.filter(room => room.urgent);
      this.roomsCreated_NotUrgent = rooms.filter(room => !room.urgent);
    });
    this.meetService.getRoomsJoinedByMe().then(rooms => {
      this.roomsJoined_Urgent = rooms.filter(room => room.urgent);
      this.roomsJoined_NotUrgent = rooms.filter(room => !room.urgent);
    });
  }

  ngOnInit() {
  }

}
