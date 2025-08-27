import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _authenticationService: AuthenticationService) {}

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this._authenticationService.currentUserValue;
    const token = this._authenticationService.getUser()?.token;
    const isLoggedIn = currentUser; //&& token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    // console.log('isLoggedIn:', isLoggedIn); // Log to check the logged in status
    // console.log('isApiUrl:', isApiUrl); // Log to check if the request is to the API URL

    // List of endpoints that should not have the Authorization header
    const authExclusionUrls = [
      '/api/Authenticate/login'
    ];

    // Check if the request URL matches any of the exclusion URLs
    const shouldExcludeAuthHeader = authExclusionUrls.some((url) =>
      request.url.includes(url)
    );
    // console.log('shouldExcludeAuthHeader:', shouldExcludeAuthHeader); // Log to check exclusion URLs

    if (isLoggedIn && isApiUrl && !shouldExcludeAuthHeader) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('Authorization header added'); // Log to confirm header addition
    }

    return next.handle(request);
  }
}
