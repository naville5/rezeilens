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
export class PolicyService {
  private apiUrl = environment.apiUrl; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  /**
   * Create a new policy
   * @param policy Policy object containing title, description, createdBy
   * @returns Observable with new policy ID
   */

  createPolicy(payload: Policy): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiUrl}/api/Policy/create-policy`,
        payload
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getAllPolicies(): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/api/Policy/get-policies`
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getAllPoliciesForUser(): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/api/Policy/get-policies-for-user`
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getPolicyById(policyId: string): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/api/Policy/get-policy/${policyId}`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

   updatePolicy(payload: UpdatePolicy): Observable<any> {
    return this.http
      .put<any>(`${environment.apiUrl}/api/Policy/update-policy`, payload)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

acknowledgePolicy(policyId: string, userId: string): Observable<any> {
  const body = { policyId, acknowledgedBy: userId };
  return this.http
    .put<any>(`${environment.apiUrl}/api/Policy/acknowledge-policy`, body, {
      headers: { 'Content-Type': 'application/json' }
    })
    .pipe(
      map((response) => response),
      catchError(this.handleError)
    );
}

  publishPolicy(policyId: string, publish: boolean): Observable<any> {
  const payload = { policyId, publish }; // Send both PolicyId and Publish flag
  return this.http
    .put<any>(`${environment.apiUrl}/api/Policy/publish-policy`, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    .pipe(
      map((response) => response),
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
