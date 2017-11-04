import { Component, OnInit } from '@angular/core';
import {Room} from "../models/room";
import {ActivatedRoute, Router} from "@angular/router";
import {MeetService} from "../services/meet.service";

import "rxjs/add/operator/mergeMap"
import {User} from "../models/user";
import {AccountService} from "../services/account.service";

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styles: []
})
export class RoomDetailComponent implements OnInit {
  room: Room;
  members: User[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private meetService: MeetService,
              private accountService: AccountService) {
    this.route.params
      .flatMap(params => {
        let roomId = +params['id'];
        return this.meetService.getRoomById(roomId);
      })
      .subscribe(room => {
        this.room = room;
      });
  }

  ngOnInit() {
  }

}
