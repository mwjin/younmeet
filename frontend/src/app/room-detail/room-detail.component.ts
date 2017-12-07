import { Component, OnInit, Optional } from '@angular/core';
import { Room } from '../models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetService } from '../services/meet.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import { UserInfo } from '../models/user-info';
import { BesttimeResponseData } from '../services/besttime-response-data';
import { AccountService } from '../services/account.service';
import { Besttime } from '../models/besttime';


declare var daum: any;

@Component({
  selector : 'app-room-detail',
  templateUrl : './room-detail.component.html',
  styleUrls : [ './room-detail.component.css' ]
})
export class RoomDetailComponent implements OnInit {
  room: Room;
  members: UserInfo[];

  bestTimes: Besttime[];
  showingBestTimes: number;

  zoom: number;
  isRoomOwner: boolean;

  shareableLink: string;
  linkCopied: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private meetService: MeetService,
              private  accountService: AccountService) {
    this.showingBestTimes = 3;
    this.route.params
      .flatMap(params => {
        const roomHash = params[ 'hash' ];
        this.shareableLink = `http://localhost:4200/link/${roomHash}`;
        return this.meetService.getRoomByHash(roomHash, true);
      })
      .flatMap(room => {
        this.room = room;
        const getMembers = this.meetService.getUsersInRoom(this.room.id)
          .then(members => {
            this.members = members.filter(user => user.id !== room.owner.id);
            this.members.unshift(members.filter(user => user.id === room.owner.id)[ 0 ]);
          });
        const getBestTime = this.meetService.getBestTime(this.room.id)
          .then(bestTime => {
            this.bestTimes = bestTime.map(bestTimeResponse => BesttimeResponseData.responseToBestTime(bestTimeResponse));
          });
        this.accountService.getUserDetail().then(currUser => {
          if (currUser.id === this.room.owner.id) {
            this.isRoomOwner = true;
          } else {
            this.isRoomOwner = false;
        }});
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

  viewMore(): void {
    if (this.showingBestTimes + 3 <= this.bestTimes.length) {
      this.showingBestTimes += 3;
    } else {
      this.showingBestTimes = this.bestTimes.length;
    }
  }


}
