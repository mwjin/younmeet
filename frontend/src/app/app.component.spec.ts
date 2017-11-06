import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLinkStubDirective, RouterOutletStubComponent} from "../testing/router-stubs";
import {Component} from "@angular/core";
import {AuthenticationServiceSpy} from "./services/authentication.service.spy";
import {AuthenticationService} from "./services/authentication.service";

@Component({
  template: ``
})
class LoginComponentMock { }


describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: AuthenticationServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponentMock}
        ]),
      ],
      declarations: [
        AppComponent,
        RouterLinkStubDirective,
        RouterOutletStubComponent,
        LoginComponentMock
      ],
      providers: [
        { provide: AuthenticationService, useClass: AuthenticationServiceSpy }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        authServiceSpy = fixture.debugElement.injector.get(AuthenticationService) as any;
      })
  }));

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('can instantiate app', async(() => {
    expect(comp).toBeTruthy();
  }));

});
