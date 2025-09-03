import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthenticationService } from '../../service';
import { Role } from '../../models';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  navigationUrl: string | null = null;
  userType: string = '';

  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) {}

  // canActivate
  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authService.currentUserValue;
    // console.log(Role.User)
    if (!currentUser) {
      return true;
    }
    // console.log('here from no auth class ', this._authService.getUser());

    this.userType =
      this._authService.getUser() == null ||
      this._authService.getUser().userType == null
        ? ''
        : this._authService.getUser().userType[0];
    if (this.userType == Role.User)
      // console.log('navigating to user submissions'),
      this._router.navigate(['/dashboard/new-submission']);
     else if (this.userType == Role.Admin) {
      this._router.navigate(['/dashboard/admin']);
    }

    return false;
  }
}
