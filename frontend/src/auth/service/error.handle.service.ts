import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

    handleError(error: HttpErrorResponse): Observable<never> {
      // console.log('An error occurred:' + error.message);
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error('An error occurred:', error.error.message);
      } else {
        // Server-side error
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // Return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later.');
    }
}
