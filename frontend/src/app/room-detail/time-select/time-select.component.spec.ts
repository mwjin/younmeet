import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectComponent } from './time-select.component';
import { CalendarModule } from 'fullcalendar-ag4';
import * as $ from 'jquery';

describe('TimeSelectComponent', () => {
  let component: TimeSelectComponent;
  let fixture: ComponentFixture<TimeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ CalendarModule.forRoot() ],
      declarations : [ TimeSelectComponent ]
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
