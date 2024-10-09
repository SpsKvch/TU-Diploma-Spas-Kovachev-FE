import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {UpdateUserRequest, UserDetails} from '../interfaces/user-interfaces';
import {CompleteTemplate, TemplateDraft, TemplateJournal} from '../interfaces/template-interfaces';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {JournalService} from "../services/journal.service";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/form-field";
import {TemplatePreviewComponent} from "../template-preview/template-preview.component";
import {MatButton} from "@angular/material/button";
import {RequestService} from "../services/request.service";
import {Constants} from "../constants";
import {restoreTypeScriptVersionForTesting} from "@angular/compiler-cli/src/typescript_support";
import {Month} from "@js-joda/core";
import {AddImageDialogComponent} from "../add-image-dialog/add-image-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCard, MatCardHeader, MatCardContent, MatLabel, TemplatePreviewComponent, MatButton, NgOptimizedImage],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss'
})
export class ProfileViewComponent implements OnInit {

  profileId!: string | undefined;
  loggedInUser!: string | null;
  userDetails!: UserDetails;
  userTemplates!: CompleteTemplate[];
  userDrafts!: TemplateDraft[] | null;
  userJournals!: TemplateJournal[] | null;
  hasAdminAccess: boolean = false;

  constructor(private profileService: ProfileService, private journalService: JournalService, private authService: AuthService,
              private router: Router, private route: ActivatedRoute, private requestService: RequestService, private dialog: MatDialog) {};

  async ngOnInit() {
    await firstValueFrom(this.route.paramMap).then(val => {
      this.profileId = val.get("username")?.toString();})

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';

    this.loggedInUser = this.profileService.getCurrentUser();
    this.userDetails = await firstValueFrom(this.profileService.getUserDetails(this.profileId!));
    this.userTemplates = await firstValueFrom(this.profileService.getUserTemplates(this.profileId!));
    await this.hasAdminPermission();

    if (this.loggedInUser !== null && this.isPersonalPage()) {
      await this.fetchPersonalContent();
    }

    
    
    
    console.log(this.userJournals)
  }

  isPersonalPage() : boolean {
    if (this.userDetails !== undefined && this.userDetails !== null) {
      return this.userDetails.username === this.loggedInUser;
    }
    return false;
  }

  async hasAdminPermission() {
    const loggedInUser = JSON.parse(localStorage.getItem("userDetails")!).username;
    if (this.profileId !== loggedInUser) {
      this.hasAdminAccess = false;
      return;
    }

    await firstValueFrom(this.requestService.getProtectedEndpoint<string[]>(Constants.getPermissionsUrl, null))
      .then(result => {
        if (result.includes("root") || result.includes("admin")) {
          this.hasAdminAccess = true;
        }
      });
  }

  getName() : string {
    if (this.userDetails.lastName !== null) {
      return this.userDetails.firstName + ' ' + this.userDetails.lastName;
    }
    return this.userDetails.firstName!;
  }

  getDateString() {
    return new Date(this.userDetails.joinDate).toLocaleDateString('de-AT').replaceAll('.', '/');
    //return datePart[2] + ' ' + Month.of(Number.parseInt(datePart[1])) + ' ' + datePart[0];
  }

  canShowEmail(): boolean {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails === null) {
      return false;
    }
    const loggedInUser = JSON.parse(localStorage.getItem("userDetails")!).username;
    return this.profileId === loggedInUser && this.userDetails.currentEmail !== null;
  }

  openImageDialog(): void {
    const dialogRef = this.dialog.open(AddImageDialogComponent, { width: "50%" });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        const url = Constants.getUserEndpoint.replace(Constants.USERNAME, this.userDetails.username);
        const request: UpdateUserRequest = {
          country: null,
          firstName: null,
          lastName: null,
          newEmail: null,
          profileImageUrl: result,
          region: null
        }

        
        this.userDetails.profileImageUrl = result;
        this.requestService.patchProtectedEndpoint<any>(url, request, null);
      }
    });
  }

  getImage(): string {
    const url = this.userDetails.profileImageUrl;
    if (url === null) {
      return "assets/img/profile.webp";
    }
    return this.userDetails.profileImageUrl!;
  }

  async redirectToAdminPage() {
    await this.router.navigate(["admin"], {state: {allowed: true}});
  }

  private async fetchPersonalContent() {
    try {
      this.userDrafts = await firstValueFrom(this.profileService.getUserDrafts(this.loggedInUser!));
      this.journalService.getAllJournalsForUser(this.loggedInUser!).then(result => {
        console.log(result)
        this.userJournals = result;
      });
    } catch (e: any) {
      if (e.status == 401) {
        
        await this.router.navigate(["/login"]);
      }
    }
  }

  async logout() {
    await this.authService.clearLoginDetailsAndRedirectToHome();
  }

}
