import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras} from '@angular/router';
import {AccountService} from "../services/account.service";

@Injectable()
export class NonUserGuard implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isNonUser();
  }

  isNonUser(): Promise<boolean> {
    return this.accountService.getUserDetail().then(
      user => {
        if (user.is_fake) {
          return true;
        } else {
          this.router.navigate(['dashboard']);
          return false;
        }
      }
    );
  }
}
