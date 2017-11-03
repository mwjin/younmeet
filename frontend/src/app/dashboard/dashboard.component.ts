import { Component, OnInit } from '@angular/core';
import {Room} from "../models/room";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  roomsCreated: Room[];
  roomsJoined: Room[];

  constructor() { }

  ngOnInit() {

  }

}
