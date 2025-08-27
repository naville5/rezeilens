import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  constructor(private _http: HttpClient) { }


   // Method to call the API and get the data
  getPoliciesWithExceptionsAndAcknowledgements(): Observable<any> {
    return this._http
      .get<any>( `${environment.apiUrl}/api/Reports/GetPoliciesWithExceptionsAndAcknowledgements`)  // Send empty string as payload (if no parameters needed)
      .pipe(
        map((response) => {
          return response;  // Return the response (you can modify it if needed)
        }),
        catchError(this.handleError)  // Handle any errors
      );
  }







  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
