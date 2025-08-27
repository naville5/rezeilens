import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  /**
   * Create a new dashboard
   * @param dashboard dashboard object containing title, description, createdBy
   * @returns Observable with new dashboard ID
   */

  getStats(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/api/Dashboard/get-stats`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('here from isnide the handel error ', error);

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
      () => new Error(`Something bad happened; please try again later.${error}`)
    );
  }
}
