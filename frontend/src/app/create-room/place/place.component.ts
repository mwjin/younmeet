import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import {FormControl} from "@angular/forms";
import {MeetService} from "../../services/meet.service";
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';
import {isUndefined} from "util";


@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  private room_id: number;
  private positionSet: boolean;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private meetService: MeetService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.route.params
      .flatMap(params => {
        this.room_id = +params[ 'id' ];
        return this.meetService.getRoomById(this.room_id);
      })
      .subscribe(room => {
        if (isUndefined(room.latitude) && isUndefined(room.longitude))
          this.positionSet = false;
        else
          this.positionSet = true;
        console.log("position set", this.positionSet);
      });

  }

  ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 37.459882;
    this.longitude = 126.95190530000002;
    let options = {
      componentRestrictions: {country: 'kr'}
    };

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    if (!this.positionSet)
      this.setCurrentPosition();

    //load Places Autocomplete

    this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();

              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }

              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 17;
              this.meetService.putPlace(this.room_id, place.name, this.latitude, this.longitude);
            });
          });
        });
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
}
