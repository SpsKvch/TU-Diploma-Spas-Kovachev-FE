import { Injectable } from '@angular/core';
import {catchError, retry, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {ErrorHandlerService} from "./error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private router: Router, private errorHandler: ErrorHandlerService) { }

  public getProtectedEndpoint<T>(url: string, queryParams: any) {
    return this.http.get<T>(url, {headers: this.authHeader(), params: queryParams})
      .pipe(retry({count: 1, resetOnSuccess: true}),
        catchError(this.errorHandler.handleErrorResponse.bind(this)));

  }

  public observePostEndpointResponse<T>(url: string) {
    return this.http.post<T>(url,
      null, {headers: this.authHeader(), observe: 'response'})
      .pipe(retry({count: 1, resetOnSuccess: true}),
        catchError(this.errorHandler.handleErrorResponse.bind(this)));
  }

  public postProtectedEndpoint<T>(url: string, body: any, queryParams: any) {
    return this.http.post<T>(url,
      body, {headers: this.authHeader(), params: queryParams})
      .pipe(retry({count: 1, resetOnSuccess: true}),
        catchError(this.errorHandler.handleErrorResponse.bind(this)));
  }

  public patchProtectedEndpoint<T>(url: string, body: any, queryParams: any) {
    return this.http.patch<T>(url, body, {headers: this.authHeader(), params: queryParams})
      .pipe(retry({count: 1, resetOnSuccess: true}),
        catchError(this.errorHandler.handleErrorResponse.bind(this)));
  }

  public putProtectedEndpoint<T>(url: string, body: any) {
    return this.http.put<T>(url, body, {headers: this.authHeader()})
      .pipe(retry({count: 1, resetOnSuccess: true}),
        catchError(this.errorHandler.handleErrorResponse.bind(this)));
  }

  public deleteProtectedEndpoint<T>(url: string) {
    return this.http.delete<T>(url, {headers: this.authHeader()})
      .pipe(retry({count: 1, resetOnSuccess: true}),
        catchError(this.errorHandler.handleErrorResponse.bind(this)));
  }

  public redirect(url: string) {
    this.router.navigate([url])
  }

  private authHeader(): HttpHeaders {
    const auth = localStorage.getItem('authToken');
    return new HttpHeaders({'Authorization': auth != null ? auth : ""});
  }

}
