import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectComponent } from './time-select.component';
import { CalendarModule } from 'fullcalendar-ag4';
import { APP_BASE_HREF, Location, PathLocationStrategy } from '@angular/common';
import { LocationStrategy } from '@angular/common';
import * as $ from 'jquery';
import { RouterTestingModule } from '@angular/router/testing';
import { FreetimeService } from '../../services/freetime.service';
import { HttpModule } from '@angular/http';
import { MeetService } from '../../services/meet.service';

describe('TimeSelectComponent', () => {
  let component: TimeSelectComponent;
  let fixture: ComponentFixture<TimeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ CalendarModule.forRoot(),
        RouterTestingModule,
        HttpModule ],
      declarations : [ TimeSelectComponent ],
      providers : [ Location,
        FreetimeService,
        MeetService,
        { provide : LocationStrategy, useClass : PathLocationStrategy },
        { provide : APP_BASE_HREF, useValue : '/' } ]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(TimeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
