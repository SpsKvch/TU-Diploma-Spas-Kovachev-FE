import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails } from '../interfaces/user-interfaces';
import { Constants } from '../constants';
import { CompleteTemplate, TemplateDraft } from '../interfaces/template-interfaces';
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  user: string | null;
  constructor(private http: HttpClient, private router: Router) {
    const userDetails = localStorage.getItem("userDetails");
    if(userDetails === null) {
      this.user = null;
    } else {
      this.user = JSON.parse(userDetails!).username;
    }
  }

  getCurrentUser(): string | null {
    return this.user;
  }

  getUserDetails(username: string) {
    return this.http.get<UserDetails>(Constants.getUserEndpoint.replace(Constants.USERNAME, username))
      .pipe(catchError(this.handleUserNotFound.bind(this)));
  }

  getUserTemplates(username: string) {
    return this.http.get<CompleteTemplate[]>(Constants.getCompleteTemplatesForUser.replace(Constants.USERNAME, username));
  }

  getUserDrafts(username: string) {
    return this.http.get<TemplateDraft[]>(Constants.getDraftsForUser.replace(Constants.USERNAME, username),
    {headers: new HttpHeaders({"Authorization": localStorage.getItem("authToken")!})});
  }

  private handleUserNotFound(error: HttpErrorResponse) {
    if (error.status == 404) {
      this.router.navigate(["/unknown"]);
    }
    return throwError(() => error);
  }

}
