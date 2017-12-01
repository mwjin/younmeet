import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../models/room";
import {Router} from "@angular/router";
import {FilterOptions} from "../room-list-filter.pipe";

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styles: [],
})
export class RoomListComponent implements OnInit {

  @Input() rooms: Room[];
  @Input() searchText: string;
  @Input() searchOption: FilterOptions;

  numRoomsShown: number = 5;
  numRoomsShownMin: number = 5;

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
