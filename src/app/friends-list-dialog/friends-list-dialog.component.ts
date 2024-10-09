import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RequestService} from "../services/request.service";
import {FriendRequest, PublicUserDetails, SimpleUserDetails} from "../interfaces/user-interfaces";
import {firstValueFrom} from "rxjs";
import {Constants} from "../constants";
import {MatCard} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-friends-list-dialog',
  standalone: true,
  imports: [
    MatCard,
    NgForOf,
    NgIf,
    RouterLink,
    MatButton,
    MatLabel
  ],
  templateUrl: './friends-list-dialog.component.html',
  styleUrl: './friends-list-dialog.component.scss'
})
export class FriendsListDialogComponent implements OnInit {

  receivedRequests: FriendRequest[] = [];
  sentRequests: FriendRequest[] = [];
  friends: PublicUserDetails[] = [];

  constructor(public dialogRef: MatDialogRef<FriendsListDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public loggedInUser: string,
              private requestService: RequestService, private router: Router, private route: ActivatedRoute) {
  }

  async ngOnInit() {
    await this.getFriendsDetails();
    
    
    
  }

  async getFriendsDetails() {
    this.receivedRequests = await firstValueFrom(
      this.requestService.getProtectedEndpoint<FriendRequest[]>(Constants.pendingFriendRequestEndpoint, null));
    this.sentRequests = await firstValueFrom(
      this.requestService.getProtectedEndpoint<FriendRequest[]>(Constants.sentFriendRequestEndpoint, null));
    this.friends = await firstValueFrom(
      this.requestService.getProtectedEndpoint<PublicUserDetails[]>(Constants.baseFriendsEndpoint, null));
  }

  async closeDialog(username: string) {
    this.dialogRef.close(username);
  }

  getConvertedDate(date: Date) {
    return new Date(date).toLocaleDateString('de-AT').replaceAll('.', '/');
  }

  async acceptRequest(username: string) {
    const url = Constants.acceptFriendRequestEndpoint.replace(Constants.FRIEND_REQUEST, username);
    await firstValueFrom(this.requestService.postProtectedEndpoint( url,null, null));
    await this.getFriendsDetails();
  }

  async declineRequest(username: string) {
    const url = Constants.declineFriendRequestEndpoint.replace(Constants.FRIEND_REQUEST, username);
    await firstValueFrom(this.requestService.deleteProtectedEndpoint( url));
    await this.getFriendsDetails();
  }

  async removeFriend(username: string) {
    const url = Constants.friendsEndpoint.replace(Constants.USERNAME, username);
    console.log(url)
    await firstValueFrom(this.requestService.deleteProtectedEndpoint<void>(url));
    await this.getFriendsDetails();
  }

}
