import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailComponent } from './room-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MeetServiceSpy } from '../services/meet.service.spy';
import { MeetService } from '../services/meet.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import "rxjs/add/observable/of"
import {AgmCoreModule} from "@agm/core";
import {Component} from "@angular/core";
import {AppModule} from "../app.module";
import {AccountService} from "../services/account.service";
import {AccountServiceSpy} from "../services/account.service.spy";

describe('RoomDetailComponent', () => {
  let component: RoomDetailComponent;
  let fixture: ComponentFixture<RoomDetailComponent>;
  let meetServiceSpy: MeetServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        RouterTestingModule,
        FormsModule,
        ClipboardModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyDBe3QLe8Z3c8Kpuw88gMHpfrgvHseQOXc',
          libraries: ["places"],
        })
      ],
      declarations : [
        RoomDetailComponent,
      ],
      providers : [
        { provide : MeetService, useClass : MeetServiceSpy },
        {
          provide : ActivatedRoute, useValue: {params: Observable.of({id: 1})}
        },
        { provide: AccountService, useValue: AccountServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDetailComponent);
    component = fixture.componentInstance;
    meetServiceSpy = fixture.debugElement.injector.get(MeetService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
