import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { LoginRequest, RegistrationRequest } from '../interfaces/template-interfaces';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SimpleUserDetails } from '../interfaces/user-interfaces';
import {funcWrapper} from "../interfaces/wrapper-interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  attemptLogin(credentials: LoginRequest) {
    return this.http.post<any>(Constants.loginUrl, credentials, this.getOptions())
    .pipe(catchError(this.handleErrorResponse.bind(this)));
  }

  register(request: RegistrationRequest) {
    
    return this.http.post<any>(Constants.registrationUrl, request, this.getOptions())
    .pipe(catchError(this.handleErrorResponse.bind(this)));
  }

  async authenticate(token: string) {
    
    const response = await firstValueFrom(this.http.post<any>(Constants.authUrl, null,
      { headers: new HttpHeaders({ 'Authorization': token }), observe: 'response' })
    .pipe(catchError(this.handleErrorResponse.bind(this))));
    
  }

  handleErrorResponse(error: HttpErrorResponse) {
    
    if (error.status == 401) {
      this.router.navigate(["/login"]);
    } else if (error.status == 403) {
      this.router.navigate(["/unknown"]);
    }
    return throwError(() => error);
  }

  getOptions(): Object {
    return {
      observe: 'response',
    }
  }

  saveAuthDetails(response: any) {
    const userDetails : SimpleUserDetails = response.body;
    const authHeader = response.headers.get("authorization");

    localStorage.setItem("authToken", "Bearer " + authHeader);
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }

  redirectToLogin() {
    this.router.navigate(["/login"]);
  }

  redirectToHome() {
    this.router.navigate(["/home"]);
  }

  async clearLoginDetailsAndRedirectToHome() {
    await this.logout()
    this.redirectToHome();
  }

  async clearLoginDetailsAndRedirectToLogin() {
    await this.logout()
    this.redirectToLogin();
  }

  private async logout() {
    const token: string = localStorage.getItem("authToken")!;
    await firstValueFrom(this.http.post(Constants.logoutUrl, null,
      {headers: new HttpHeaders({ 'Authorization': token })}))
    localStorage.removeItem("authToken");
    localStorage.removeItem("userDetails");
  }

}
