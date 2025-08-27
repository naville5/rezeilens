import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Policy {
  policyTitle: string;
  description?: string;
  createdBy: string;
}

export interface UpdatePolicy {
  policyTitle: string;
  description?: string;
  policyId: string;
}

@Injectable({
  providedIn: 'root',
})
export class RiskExceptionService {
  private apiUrl = environment.apiUrl; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  /**
   * Create a new policy
   * @param policy Policy object containing title, description, createdBy
   * @returns Observable with new policy ID
   */

getPublishedPoliciesForException(): Observable<any> {
  return this.http
    .get<any>(`${environment.apiUrl}/api/RiskException/published-policies-for-exception`)
    .pipe(
      map((response) => response),
      catchError(this.handleError)
    );
}

submitRiskException(payload: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/api/RiskException/submit-risk-exception`, payload)
    .pipe(
      map(response => response),
      catchError(this.handleError)
    );
}

getAllRiskExceptions(): Observable<any> {
  return this.http
    .get<any>(`${environment.apiUrl}/api/RiskException/all-risk-exceptions`)
    .pipe(
      map((response) => response),
      catchError(this.handleError)
    );
}

updateRiskExceptionStatus(payload: any): Observable<any> {
  return this.http.post<any>(
    `${environment.apiUrl}/api/RiskException/update-risk-exception-status`,
    payload
  ).pipe(
    map(response => response),
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
