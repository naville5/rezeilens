import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Observable to subscribe to for the current user
  public currentUser: Observable<User>;

  // BehaviorSubject to hold the current user's state
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
    const storedUser = this.getUser();
    this.currentUserSubject = new BehaviorSubject<User>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter to retrieve the current user value synchronously
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * User login
   *
   * @param username
   * @param password
   * @returns user
   */
  login(username: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/api/Authentication/login`, {
        username,
        password,
      })
      .pipe(
        map((response) => {
          // Login successful if there's a JWT token in the response
          if (response && response.token) {
            this.setUser(response);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  public getHeaders(): HttpHeaders {
    const token = this.getUser()?.token;
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('Token not found in AuthService.');
      return new HttpHeaders();
    }
  }

  // Set user data in storage
  private setUser(response: any): void {
    localStorage.setItem('currentUser', JSON.stringify(response)); // Store user details and token

    this.currentUserSubject.next(response); // Update BehaviorSubject with user data
  }

  // Retrieve user data from storage
  getUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
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

  isAuthenticated(): boolean {
    // Check if authentication token or user details exist
    return !!localStorage.getItem('token');
  }

  /**
   * User logout
   *
   */
  logout(): void {
    this.removeUser();
    this.currentUserSubject.next(null);
  }

  private removeUser(): void {
    localStorage.removeItem('currentUser');
  }
}
