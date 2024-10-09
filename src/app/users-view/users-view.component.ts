import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatPrefix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {RequestService} from "../services/request.service";
import {Constants} from "../constants";
import {catchError, firstValueFrom} from "rxjs";
import {PublicUserDetails} from "../interfaces/user-interfaces";
import {Router, RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {ErrorHandlerService} from "../services/error-handler.service";

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatFormField,
    MatInput,
    MatCardContent,
    MatButton,
    NgForOf,
    FormsModule,
    MatIcon,
    MatPrefix,
    RouterLink
  ],
  templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.scss'
})
export class UsersViewComponent implements OnInit {

  private readonly fetchedUsersCount = 25
  loggedInUserFriends: string[] = [];
  fetchedUsers: PublicUserDetails[] = [];
  searchQuery: string = '';

  constructor(private requestService: RequestService, private router: Router, private errorHandler: ErrorHandlerService) {
    const rawUserDetails: string | null = localStorage.getItem("userDetails")
    if (rawUserDetails !== null) {
      const userFriends = JSON.parse(rawUserDetails!).friends;
      if (userFriends !== null && userFriends !== undefined) {
        this.loggedInUserFriends = userFriends;
      }
    }
  }

  async ngOnInit() {
    this.fetchedUsers = await firstValueFrom(this.requestService
      .getProtectedEndpoint<PublicUserDetails[]>(Constants.userEndpoint, {count: this.fetchedUsersCount})
      .pipe(catchError(this.errorHandler.handleErrorResponse.bind(this))));
  }

  async searchUsers() {
    
    const users = await firstValueFrom(this.requestService
      .getProtectedEndpoint<PublicUserDetails[]>(Constants.searchUsersEndpoint, {search: this.searchQuery})
      .pipe(catchError(this.errorHandler.handleErrorResponse.bind(this))));
    
    this.fetchedUsers = users;
  }

  async sendFriendRequest(user: string) {
    
    await firstValueFrom(this.requestService
      .postProtectedEndpoint(Constants.baseFriendRequestsEndpoint, null, {recipient: user})
      .pipe(catchError(this.errorHandler.handleErrorResponse.bind(this))));
;
  }

  getJoinDate(datetime: Date) {
    const date = datetime.toString().split('T')[0];
    return 'Joined on: ' + date;
  }

  userIsAlreadyFriend(user: string) {
    return this.loggedInUserFriends.includes(user);
  }

}
