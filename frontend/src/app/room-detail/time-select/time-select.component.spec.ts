import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectComponent } from './time-select.component';
import { CalendarModule } from 'fullcalendar-ag4';
import { APP_BASE_HREF, Location, PathLocationStrategy } from '@angular/common';
import { LocationStrategy } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FreetimeService } from '../../services/freetime.service';
import { HttpModule } from '@angular/http';
import { MeetService } from '../../services/meet.service';
import { MeetServiceSpy } from '../../services/meet.service.spy';
import { FreetimeServiceSpy } from '../../services/freetime.service.spy';

describe('TimeSelectComponent', () => {
  let component: TimeSelectComponent;
  let fixture: ComponentFixture<TimeSelectComponent>;
  let meetServiceSpy: MeetServiceSpy;
  let freetimeServiceSpy: FreetimeServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ CalendarModule.forRoot(),
        RouterTestingModule,
        HttpModule ],
      declarations : [ TimeSelectComponent ],
      providers : [ Location,
        { provide : FreetimeService, useClass : FreetimeServiceSpy },
        { provide : MeetService, useClass : MeetServiceSpy },
        { provide : LocationStrategy, useClass : PathLocationStrategy },
        { provide : APP_BASE_HREF, useValue : '/' } ]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(TimeSelectComponent);
    component = fixture.componentInstance;
    meetServiceSpy = fixture.debugElement.injector.get(MeetService) as any;
    freetimeServiceSpy = fixture.debugElement.injector.get(FreetimeService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
