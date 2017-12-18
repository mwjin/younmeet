import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room';
import { MeetService } from '../services/meet.service';
import {User} from "../models/user";
import { SortOptions } from './room-list-sort-options';
import { FilterOptions } from './room-list-filter-options';

@Component({
  selector : 'app-dashboard',
  templateUrl : './dashboard.component.html',
  styleUrls : ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public user: User;
  public roomsCreated: Room[];
  public roomsJoined: Room[];
  public latitude: number;
  public longitude: number;

  sortOptions: SortOptions[] = ["Best Time", "# Members", "Created Time"];
  currentSortOption: SortOptions = "Best Time";

  currentSearchOption: FilterOptions = "All";
  searchText: string;

  constructor(private meetService: MeetService) {
    this.meetService.getRoomsCreatedByMe().then(rooms => {
      this.roomsCreated = rooms;
    });
    this.meetService.getRoomsJoinedByMe().then(rooms => {
      this.roomsJoined = rooms;
      console.log(this.roomsJoined);
    });
  }

  ngOnInit() {
  }

}
