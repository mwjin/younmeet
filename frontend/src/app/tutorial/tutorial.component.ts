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
    this.tutorialUrl + '1.login1.png',
    this.tutorialUrl + '2.dashboard1.png',
    this.tutorialUrl + '3.create1.png',
    this.tutorialUrl + '4.place1.png',
    this.tutorialUrl + '5.select_time1.png',
    this.tutorialUrl + '6.select_time3.png',
    this.tutorialUrl + '7.room-detail1.png',
    this.tutorialUrl + '8.login2.png',
    this.tutorialUrl + '9.non_member_login.png',
    this.tutorialUrl + '10.room-detail2.png',
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
  }


}
