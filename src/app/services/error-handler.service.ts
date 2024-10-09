import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private router: Router, private http: HttpClient) { }

  handleErrorResponse(error: HttpErrorResponse) {
    if (error.status == 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      this.router.navigate(["/login"]);
    } else if (error.status == 403) {
      this.router.navigate(["/unknown"]);
    } else if (error.status == 404) {
      this.router.navigate(["/unknown"]);
    }
    return throwError(() => error);
  }
}
