import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import {FormControl} from "@angular/forms";
import {MeetService} from "../../services/meet.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';
import {isUndefined} from "util";
import {AccountService} from "../../services/account.service";
import {DaumApiService} from "../../services/daum-api.service";
import {Place} from "../../models/place";
import {SuiTabset} from "ng2-semantic-ui/dist";

const REST_API_KEY = '7580e2a44a5e572cbd87ee388f620122';


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
  public roomId: number;
  public roomHash: string;
  public googleSearchResult: google.maps.places.PlaceResult;
  public firstTimePlaceSetting: boolean;
  public isPlaceSelected: boolean;
  public restaurant_list: Place[];
  public cafe_list: Place[];
  public cultural_faculty_list: Place[];
  public labelOptions = {
    color: '#CC0000',
    fontFamily: '',
    fontSize: '14px',
    fontWeight: 'bold',
    text: 'Some Text',
  }

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
  ) {
    this.restaurant_list = [];
    this.cafe_list = [];
    this.cultural_faculty_list = [];
    this.place = new Place();
    this.route.params
      .flatMap(params => {
        this.roomHash = params['hash'];
        return this.meetService.getRoomByHash(this.roomHash);
      })
      .subscribe(room => {
        this.roomId = room.id;
        accountService.getUserDetail().then(
          currUser => {
            if (currUser.id !== room.owner.id) {
              alert("Not allowed!\nNot owner of this room!");
              location.back();
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
      });

  }

  ngOnInit() {
    // set google maps defaults
    this.zoom = 15;
    const options = {
      componentRestrictions: {country: 'kr'}
    };

    // create search FormControl
    this.searchControl = new FormControl();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
          const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
          autocomplete.addListener("place_changed", () => {
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
                  this.restaurant_list = restaurant_list;
                });
              this.daumService.getNearCafes(lat, lng)
                .then(cafe_list => {
                  this.cafe_list = cafe_list;
                });
              this.daumService.getNearCulturalFaculties(lat, lng)
                .then(cultural_faculty_list => {
                  this.cultural_faculty_list = cultural_faculty_list;
                });
              this.cdRef.detectChanges();
            });
          });
        });
  }

  private onSelectPlace(place: Place): void {
    this.place.name = place.name;
    this.place.latitude = place.latitude;
    this.place.longitude = place.longitude;
  }


  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.place.latitude = position.coords.latitude;
        this.place.longitude = position.coords.longitude;
        this.place.name = "ME";
        this.zoom = 15;
      });
    }
  }

  private onSubmit(): void {
    this.zoom = 17;
    this.meetService.putPlace(this.roomId, this.place.name, this.place.latitude, this.place.longitude).then(
       isPutPlaceSuccess => {
        if (isPutPlaceSuccess) {
          if (this.firstTimePlaceSetting)
            this.router.navigate(['room', this.roomHash, 'time']);
          else
            this.router.navigate(['room', this.roomHash]);
        }
      }
    );
  }

  private goBack(): void {
    this.location.back();
  }

}
