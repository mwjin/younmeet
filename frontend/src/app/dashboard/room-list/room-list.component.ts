import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../models/room";
import {Router} from "@angular/router";

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styles: []
})
export class RoomListComponent implements OnInit {

  @Input() rooms: Room[];

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
