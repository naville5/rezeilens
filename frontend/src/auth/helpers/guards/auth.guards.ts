import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationStart,
} from '@angular/router';

import { AuthenticationService } from '../../service';
import { Role } from '../../models';
import { routes } from '../../../app/app.routes';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  userType: string = '';

  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authService
   */
  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) {}

  // canActivate
  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authService.currentUserValue;
    // console.log(currentUser)
    if (currentUser) {
       // Get the user type from the authentication service
       const userType = this._authService.getUser().userType[0];
      //  console.log('userType'  +userType)
      //  console.log(_route)
       const requiredRoles = _route.data['role'] as Role;

      //  console.log('Role: ' + userType);
      //  console.log('requiredRole: ' + requiredRoles);

       // Check if the user's role matches the required role
       if (requiredRoles.includes(userType)) {
         return true;
       } else {
         // Redirect to an appropriate page or show an error
         this._router.navigate(['/pages/forbidden']); // or any other route you prefer
         return false;
       }
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/pages/login'], {
      // queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
