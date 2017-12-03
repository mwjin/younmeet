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
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public roomId: number;
  public roomHash: string;
  public googlePlaceResult: google.maps.places.PlaceResult;
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

  @ViewChild("search")
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
    this.route.params
      .flatMap(params => {
        this.roomHash = params['hash'];
        console.log(this.roomHash);
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
          this.latitude = room.latitude;
          this.longitude = room.longitude;
          this.firstTimePlaceSetting = false;
         }
        this.isPlaceSelected = false;
      });

  }

  ngOnInit() {
    // set google maps defaults
    this.zoom = 15;
    let options = {
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
              this.googlePlaceResult = autocomplete.getPlace();


              // verify result
              if (this.googlePlaceResult.geometry === undefined || this.googlePlaceResult.geometry === null) {
                return;
              }
              this.isPlaceSelected = true;
              this.latitude = this.googlePlaceResult.geometry.location.lat();
              this.longitude = this.googlePlaceResult.geometry.location.lng();
              this.daumService.getNearRestaurants(this.latitude, this.longitude)
                .then(restaurant_list => {
                  this.restaurant_list = restaurant_list;
                });
              this.daumService.getNearCafes(this.latitude, this.longitude)
                .then(cafe_list => {
                  this.cafe_list = cafe_list;
                });
              this.daumService.getNearCulturalFaculties(this.latitude, this.longitude)
                .then(cultural_faculty_list => {
                  this.cultural_faculty_list = cultural_faculty_list;
                });
              this.cdRef.detectChanges();
            });
          });
        });
  }

  private onSelectPlace(place: Place): void {

  }


  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }

  private onSubmit(): void {
    this.zoom = 17;
    this.meetService.putPlace(this.roomId, this.googlePlaceResult.name, this.latitude, this.longitude).then(
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
