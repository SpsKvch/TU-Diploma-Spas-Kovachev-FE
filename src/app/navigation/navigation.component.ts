import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router, RouterLink, RouterModule, ROUTES} from '@angular/router';
import {SimpleUserDetails} from '../interfaces/user-interfaces';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatButton, MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatBadge} from "@angular/material/badge";
import {MatDialog} from "@angular/material/dialog";
import {FriendsListDialogComponent} from "../friends-list-dialog/friends-list-dialog.component";
import {routes} from "../app.routes";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MatToolbar, MatButtonToggle,
    MatButton, MatFormField, MatIcon, MatInput, MatLabel,
    MatPrefix, MatSidenavContainer, MatSidenav, MatSidenavContent,
    RouterLink, MatFabButton, MatMiniFabButton, MatBadge],
  //templateUrl: './navigation.component.html',
  templateUrl: './nav.html',
  //styleUrl: './navigation.component.css'
  styleUrl: './nav.scss'
})
export class NavigationComponent implements OnInit {

  sideNavEnabled: boolean = true;
  token!: string | null;
  userDetails!: SimpleUserDetails | null;
  pendingFriendRequests: number | null = null;

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {
    this.router.events.subscribe(val => {
      this.token = localStorage.getItem("authToken");
      this.userDetails = JSON.parse(localStorage.getItem("userDetails")!);
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem("authToken");
    this.userDetails = JSON.parse(localStorage.getItem("userDetails")!);
  }

  get isLoggedIn() {
    var token = localStorage.getItem("authToken");
    return token != null && this.userDetails?.username != null;
  }

  get username() {
    return this.userDetails?.username;
  }

  get userPageRedirect() {
    return "/users/" + this.username;
  }

  redirectToLogin() {
    this.router.navigate(["/login"]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FriendsListDialogComponent, {
      data: this.userDetails?.username!, height: "648px", width: "70%", disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      
      
      if (result !== undefined) {
        this.router.navigate(["/users/" + result]);
      }
    });
  }

  protected readonly open = open;
}
