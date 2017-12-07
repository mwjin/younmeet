import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import {FormControl} from "@angular/forms";
import {MeetService} from "../../services/meet.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import {AccountService} from "../../services/account.service";
import {DaumApiService} from "../../services/daum-api.service";
import {Place} from "../../models/place";
import { Observable } from 'rxjs/Observable';

import "rxjs/add/observable/fromPromise";
import { Room } from '../../models/room';
import {Http, Headers} from "@angular/http";


@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: [
    './place.component.css',
    '../../../../node_modules/snazzy-info-window/dist/snazzy-info-window.css'
  ]
})
export class PlaceComponent implements OnInit {
  public place: Place;
  public searchControl: FormControl;
  public zoom: number;
  public currentRoom: Room;
  public googleSearchResult: google.maps.places.PlaceResult;
  public firstTimePlaceSetting: boolean;
  public isPlaceSelected: boolean;
  public restaurant_list: Place[];
  public cafe_list: Place[];
  public cultural_faculty_list: Place[];
  public selected: string;

  private API_KEY = '7580e2a44a5e572cbd87ee388f620122';
  // headers cannot have CSRF tokens
  private headers = new Headers({'Authorization': 'KakaoAK ' + this.API_KEY});


  public labelOptions = {
    color: '#CC0000',
    fontFamily: '',
    fontSize: '14px',
    fontWeight: 'bold',
    text: 'Some Text',
  };
  googleMapOptions = {
    componentRestrictions: {country: 'kr'}
  };

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private meetService: MeetService,
              private route: ActivatedRoute,
              private location: Location,
              private accountService: AccountService,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              private daumService: DaumApiService,
              private http: Http,
  ) {
    this.restaurant_list = [];
    this.cafe_list = [];
    this.cultural_faculty_list = [];
    this.place = new Place();

    // set google maps defaults
    this.zoom = 15;

    // create search FormControl
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.meetService.getCurrentRoom(this.route)
      .flatMap(room => {
        this.currentRoom = room;
        // check user
        this.accountService.getUserDetail().then(
          currUser => {
            if (currUser.id !== room.owner.id) {
              alert('Not allowed!\nNot owner of this room!');
              this.location.back();
            }
          }
        );
        if (room.latitude == null || room.longitude == null) {
          this.setCurrentPosition();
          this.firstTimePlaceSetting = true;
        }
        else {
          this.place.latitude = room.latitude;
          this.place.longitude = room.longitude;
          this.place.name = room.place;
          this.firstTimePlaceSetting = false;
         }
        this.isPlaceSelected = false;
        return Observable.fromPromise(this.mapsAPILoader.load());
      })
    // load Places Autocomplete
      .subscribe(() => {
      // use google service
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, this.googleMapOptions);
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            // get the place result
            this.googleSearchResult = autocomplete.getPlace();
            // verify result
            if (this.googleSearchResult.geometry === undefined || this.googleSearchResult.geometry === null) {
              return;
            }
            this.isPlaceSelected = true;
            this.place.name = this.googleSearchResult.name;
            this.place.latitude = this.googleSearchResult.geometry.location.lat();
            this.place.longitude = this.googleSearchResult.geometry.location.lng();

            const lat = this.googleSearchResult.geometry.location.lat();
            const lng = this.googleSearchResult.geometry.location.lng();
            this.daumService.getNearRestaurants(lat, lng)
              .then(restaurant_list => {
                this.restaurant_list = restaurant_list.filter(p => p.name !== this.googleSearchResult.name);
              });
            this.daumService.getNearCafes(lat, lng)
              .then(cafe_list => {
                this.cafe_list = cafe_list.filter(p => p.name !== this.googleSearchResult.name);
              });
            this.daumService.getNearCulturalFaculties(lat, lng)
              .then(cultural_faculty_list => {
                this.cultural_faculty_list = cultural_faculty_list.filter(p => p.name !== this.googleSearchResult.name);
              });
            this.cdRef.detectChanges();
          });
        });
      });
  }

  // TODO: When clicking back on the searched place, the marker should be one
  private onSelectSearchedMarker(): void {
    this.place.name = this.googleSearchResult.name;
    this.place.latitude = this.googleSearchResult.geometry.location.lat();
    this.place.longitude = this.googleSearchResult.geometry.location.lng();
  }

  private onSelectPlace(place: Place): void {
    this.place.name = place.name;
    this.place.latitude = place.latitude;
    this.place.longitude = place.longitude;
  }

  observableSource = (keyword: any): Observable<any[]> => {
    const size = 5;
    const url: string = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${keyword}&size=${size}`;
    if (keyword) {
      return Observable.fromPromise(this.daumService.getQueryPlaces(keyword));
    } else {
      return Observable.of([]);
    }
  }


  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.place.latitude = position.coords.latitude;
        this.place.longitude = position.coords.longitude;
        this.place.name = 'ME';
        this.zoom = 15;
      });
    }
  }

  private onSubmit(): void {
    this.zoom = 17;
    this.meetService.putPlace(this.currentRoom.id, this.place.name, this.place.latitude, this.place.longitude).then(
       isPutPlaceSuccess => {
        if (isPutPlaceSuccess) {
          if (this.firstTimePlaceSetting)
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
