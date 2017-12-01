import { Component, OnInit, Optional } from '@angular/core';
import { Room } from '../models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetService } from '../services/meet.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../models/user-info';
import { Location } from '@angular/common';
import { BesttimeResponseData } from '../services/besttime-response-data';
import { Besttime } from '../models/besttime';
import {Timespan} from "../models/timespan";
import {AccountService} from "../services/account.service";
import {TimespanResponseData} from "../services/timespan-response-data";

@Component({
  selector : 'app-room-detail',
  templateUrl : './room-detail.component.html',
  styleUrls : ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {
  room: Room;
  members: UserInfo[];
  availableTime: Besttime[];
  zoom: number;
  isRoomOwner: boolean;

  shareableLink: string;
  linkCopied: boolean = false;
  _popupOpen: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private meetService: MeetService,
              private location: Location,
              private  accountService: AccountService) {
    this.route.params
      .flatMap(params => {
        let roomHash = params[ 'hash' ];
        this.shareableLink = `http://localhost:4200/link/${roomHash}`;
        return this.meetService.getRoomByHash(roomHash);
      })
      .flatMap(room => {
        this.room = room;
        console.log(room);
        let getMembers = this.meetService.getUsersInRoom(this.room.id)
          .then(members => {
            this.members = members.filter(user => user.id !== room.owner.id);
            this.members.unshift(members.filter(user => user.id === room.owner.id)[ 0 ]);
          });
        let getBestTime = this.meetService.getBestTime(this.room.id)
          .then(bestTime => {
            this.availableTime = bestTime.map(bestTimeResponse => BesttimeResponseData.responseToBestTime(bestTimeResponse));
            console.log(this.availableTime);
          });
        this.accountService.getUserDetail().then(currUser => {
          if (currUser.id === this.room.owner.id)
            this.isRoomOwner = true;
          else
            this.isRoomOwner = false;
          console.log(this.isRoomOwner);
        });
        return Observable.forkJoin(getMembers, getBestTime);
      })
      .subscribe();
  }


  ngOnInit() {
    this.zoom = 15;
  }

  goBack(): void {
    this.router.navigate([ 'dashboard' ]);
  }

  goTimeSelectPage(): void {
    this.router.navigate([ 'room', this.room.hashid, 'time' ]);
  }

  goPlaceChangePage(): void {
    this.router.navigate([ 'room', this.room.hashid, 'place' ]);
  }


}
