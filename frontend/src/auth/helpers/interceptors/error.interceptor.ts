import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../../service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * @param {Router} _router
   * @param {AuthenticationService} _authService
   * @param {NotificationService} _notificationService
   */
  constructor(
    private _router: Router,
    private _authService: AuthenticationService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // List of endpoints that should not have the Authorization header
        const authExclusionUrl = ['/api/Authenticate/login'];
        // Check if the request URL matches any of the exclusion URLs
        const shouldExcludeAuthUrl = authExclusionUrl.some((url) =>
          request.url.includes(url)
        );
        if ([401].indexOf(err.status) !== -1 && !shouldExcludeAuthUrl) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this._router.navigate(['/pages/not-authorized']);

          // ? Can also logout and reload if needed
          // this._authenticationService.logout();
          // location.reload(true);
        }
        // throwError
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
