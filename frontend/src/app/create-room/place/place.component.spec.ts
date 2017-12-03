import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceComponent } from './place.component';
import {RouterTestingModule} from "@angular/router/testing";
import {SuiModule} from "ng2-semantic-ui/dist";
import {MeetService} from "../../services/meet.service";
import {MeetServiceSpy} from "../../services/meet.service.spy";
import {RouterLinkStubDirective} from "../../../testing/router-stubs";
import {AgmCoreModule, MapsAPILoader} from "@agm/core";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AccountService} from "../../services/account.service";
import {AccountServiceSpy} from "../../services/account.service.spy";
import {ClipboardModule} from "ngx-clipboard/dist";
import {DaumApiService} from "../../services/daum-api.service";
import {DaumApiServiceSpy} from "../../services/daum-api.service.spy";

describe('PlaceComponent', () => {
  let component: PlaceComponent;
  let fixture: ComponentFixture<PlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SuiModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyDBe3QLe8Z3c8Kpuw88gMHpfrgvHseQOXc',
          libraries: ["places"],
        }),
        FormsModule,
        ClipboardModule,
      ],
      declarations: [
        PlaceComponent,
        RouterLinkStubDirective,
      ],
      providers: [
        { provide: MeetService, useClass: MeetServiceSpy },
        {
          provide : ActivatedRoute, useValue: {
          params: Observable.of({'id': 1})
        }},
        { provide: AccountService, useClass: AccountServiceSpy },
        { provide: DaumApiService, useClass: DaumApiServiceSpy },
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




