import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room';
import { MeetService } from '../services/meet.service';
import { User } from '../models/user';
import { FilterOptions } from './room-list-filter-options';

@Component({
  selector : 'app-dashboard',
  templateUrl : './dashboard.component.html',
  styleUrls : ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public user: User;
  public roomsCreated_Urgent: Room[];
  public roomsCreated_NotUrgent: Room[];
  public roomsJoined_Urgent: Room[];
  public roomsJoined_NotUrgent: Room[];
  public latitude: number;
  public longitude: number;

  filters: FilterOptions[] = [ 'All', 'Name', 'Location' ];
  searchText: string;
  currentSearchOption: FilterOptions = 'All';

  constructor(private meetService: MeetService) {
    this.meetService.getRoomsCreatedByMe().then(rooms => {
      this.roomsCreated_Urgent = rooms;
    });
    this.meetService.getRoomsJoinedByMe().then(rooms => {
      this.roomsJoined_Urgent = rooms;
    });
  }

  ngOnInit() {
  }

}
