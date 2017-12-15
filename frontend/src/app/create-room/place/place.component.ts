import { Component, OnInit} from '@angular/core';
import { } from 'googlemaps';
import {MeetService} from "../../services/meet.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import {AccountService} from "../../services/account.service";
import {DaumApiService} from "../../services/daum-api.service";
import {Place} from "../../models/place";
import { Observable } from 'rxjs/Observable';

import "rxjs/add/observable/fromPromise";
import { Room } from '../../models/room';
import {FreetimeService} from "../../services/freetime.service";


@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css',]
})
export class PlaceComponent implements OnInit {
  public zoom: number;
  public currentRoom: Room;
  public goToTimeOnSubmit: boolean;
  public isPlaceSelected: boolean;
  public restaurant_list: Place[];
  public cafe_list: Place[];
  public cultural_faculty_list: Place[];
  public selected: Place;
  public search_place: Place;

  constructor(private meetService: MeetService,
              private route: ActivatedRoute,
              private location: Location,
              private accountService: AccountService,
              private router: Router,
              private daumService: DaumApiService,
  ) {
    this.restaurant_list = [];
    this.cafe_list = [];
    this.cultural_faculty_list = [];
    this.selected = new Place();
    // set google maps defaults
    this.zoom = 15;
  }

  ngOnInit() {
    this.meetService.getCurrentRoom(this.route)
      .subscribe(room => {
        this.currentRoom = room;
        // check user
        this.accountService.getUserDetail().then(currUser => {
            if (currUser.id !== room.owner.id) {
              alert('Not allowed!\nNot owner of this room!');
              this.location.back();
            }
          }
        );
        if (room.latitude == null || room.longitude == null) {
          this.setCurrentPosition();
          // if the person has not selected room
          // think that the person has not selected time
          this.goToTimeOnSubmit = true;
        }
        else {
          this.selected.latitude = room.latitude;
          this.selected.longitude = room.longitude;
          this.selected.name = room.place;
          this.goToTimeOnSubmit = false;
         }
        this.isPlaceSelected = false;
      });
  }

  public onPlaceChange() {
    if (this.search_place.latitude) {
      this.selected = this.search_place;
      this.isPlaceSelected = true;
      const lat = this.selected.latitude;
      const lng = this.selected.longitude;
      this.daumService.getNearRestaurants(lat, lng)
        .then(restaurant_list => {
          this.restaurant_list = restaurant_list.filter(p => p.name !== this.selected.name);
        });
      this.daumService.getNearCafes(lat, lng)
        .then(cafe_list => {
          this.cafe_list = cafe_list.filter(p => p.name !== this.selected.name);
        });
      this.daumService.getNearCulturalFaculties(lat, lng)
        .then(cultural_faculty_list => {
          this.cultural_faculty_list = cultural_faculty_list.filter(p => p.name !== this.selected.name);
        });
    }
  }

  observableSource = (keyword: any): Observable<any[]> => {
    if (keyword) {
      return Observable.fromPromise(this.daumService.getQueryPlaces(keyword));
    } else {
      return Observable.of([]);
    }
  }

  list_formatter(data: any): string {
    return `${data['name']}, ${data['address_name']}`;
  }

  value_formatter(data: any): string {
    return `${data['name']}`;
  }

  public onSelectRecommendation(place: Place) {
    this.selected = place;
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.selected.latitude = position.coords.latitude;
        this.selected.longitude = position.coords.longitude;
        this.selected.name = 'ME';
      });
    }
  }

  public goToTimeSelect() {
    this.router.navigate(['room', this.currentRoom.hashid, 'time']);
  }

  private goToUrl(place: Place) {
    window.open(place.url, '_blank');
  }

  private onSubmit(): void {
    this.meetService.putPlace(this.currentRoom.id, this.selected.name, this.selected.latitude, this.selected.longitude).then(
       isPutPlaceSuccess => {
        if (isPutPlaceSuccess) {
          if (this.goToTimeOnSubmit)
            this.router.navigate(['room', this.currentRoom.hashid, 'time']);
          else
            this.router.navigate(['room', this.currentRoom.hashid]);
        }
      }
    );
  }

  private goBack(): void {
    this.location.back();
  }

}
