import {Component, OnInit, ViewChild} from '@angular/core';
import {SwiperComponent, SwiperConfigInterface, SwiperDirective} from "ngx-swiper-wrapper";

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  public show: boolean;
  private tutorialUrl = '../../assets/images/tutorial/';

  public slides = [
    this.tutorialUrl + 'testing.png',
    this.tutorialUrl + 'login.png',
    this.tutorialUrl + 'dashboard.png',
    this.tutorialUrl + 'room_detail.png',
  ];
  public type = 'component';

  public config: SwiperConfigInterface = {
    scrollbar: null,
    direction: 'horizontal',
    slidesPerView: 1,
    scrollbarHide: true,
    keyboardControl: true,
    mousewheelControl: true,
    scrollbarDraggable: true,
    scrollbarSnapOnRelease: true,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev'
  };

  constructor() { }

  ngOnInit() {
    this.show = true;

  }

  @ViewChild(SwiperComponent) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;


  toggleType() {
    this.type = this.type == 'component' ? 'directive' : 'component';
  }

  toggleDirection() {
    this.config.direction = (this.config.direction == 'horizontal') ? 'vertical' : 'horizontal';
  }

  toggleSlidesPerView() {
    if (this.config.slidesPerView != 1) {
      this.config.slidesPerView = 1;
    } else {
      this.config.slidesPerView = +this.config.slidesPerView + 1;
    }
  }

  toggleOverlayControls() {
    if (this.config.pagination) {
      this.config.scrollbar = '.swiper-scrollbar';
      this.config.pagination = null;
      this.config.nextButton = null;
      this.config.prevButton = null;
    } else if (this.config.scrollbar) {
      this.config.scrollbar = null;
    } else {
      this.config.pagination = '.swiper-pagination';
      this.config.nextButton = '.swiper-button-next';
      this.config.prevButton = '.swiper-button-prev';
    }
  }

  toggleKeyboardControl() {
    this.config.keyboardControl = !this.config.keyboardControl;
  }

  toggleMouseWheelControl() {
    this.config.mousewheelControl = !this.config.mousewheelControl;
  }

  onIndexChange(index: number) {
    console.log('Swiper index: ' + index);
  }


}
