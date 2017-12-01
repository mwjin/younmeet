import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLinkStubDirective, RouterOutletStubComponent} from "../testing/router-stubs";
import {Component} from "@angular/core";
import {AuthenticationServiceSpy} from "./services/authentication.service.spy";
import {AuthenticationService} from "./services/authentication.service";
import {Location} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  template: ``
})
class LoginComponentMock { }


describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: AuthenticationServiceSpy;
  let router: Router;
  let location: Location;

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
        router = fixture.debugElement.injector.get(Router);
        location = fixture.debugElement.injector.get(Location);
        comp = fixture.componentInstance;
        authServiceSpy = fixture.debugElement.injector.get(AuthenticationService) as any;

        router.initialNavigation();
      })
  }));

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('can instantiate app', async(() => {
    expect(comp).toBeTruthy();
  }));

  /*
  describe('logOut', () => {
    it('logouts the user and redirects to login page',
      async(inject([Router], (router: Router) => {
      comp.logOut();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(authServiceSpy.logOut).toHaveBeenCalled();
        expect(location.path()).toContain('login');
      });
    })));
  });
  */

});
