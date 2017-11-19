import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectComponent } from './time-select.component';
import { CalendarModule } from 'fullcalendar-ag4';
import { APP_BASE_HREF, Location, PathLocationStrategy } from '@angular/common';
import { LocationStrategy } from '@angular/common';
import * as $ from 'jquery';

describe('TimeSelectComponent', () => {
  let component: TimeSelectComponent;
  let fixture: ComponentFixture<TimeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ CalendarModule.forRoot() ],
      declarations : [ TimeSelectComponent ],
      providers : [ Location,
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
