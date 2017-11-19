import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomListComponent } from './room-list.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Component} from "@angular/core";
import {RouterLinkStubDirective} from "../../../testing/router-stubs";
import {RoomListFilterPipe} from "../room-list-filter.pipe";

@Component({
  template: ``
})
class RoomDetailComponentMock {}

describe('RoomListComponent', () => {
  let component: RoomListComponent;
  let fixture: ComponentFixture<RoomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'room/:id', component: RoomDetailComponentMock }
        ]),
      ],
      declarations: [
        RoomListComponent,
        RouterLinkStubDirective,
        RoomDetailComponentMock,
        RoomListFilterPipe
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
