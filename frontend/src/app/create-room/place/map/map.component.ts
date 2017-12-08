import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Place} from "../../../models/place";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() place: Place;
  private old_place = 'nothing';
  public zoom = 16;


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.place.previousValue)
        this.old_place = changes.place.previousValue.name;

  }



}
