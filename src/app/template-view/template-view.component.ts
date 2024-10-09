import {Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {
  CompleteTemplate,
  ErrorResponse,
  NavDetails,
  Step,
  TEMPLATE_TYPE,
  TemplateDraft, TemplateJournal
} from '../interfaces/template-interfaces';
import {Observable, catchError, firstValueFrom, throwError, max} from 'rxjs';
import {TemplateService} from '../services/template.service';
import {TemplateNavComponent} from '../template-nav/template-nav.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatLabel} from "@angular/material/form-field";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardHeader, MatCardMdImage} from "@angular/material/card";
import {MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatList, MatListItem} from "@angular/material/list";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDivider} from "@angular/material/divider";
import {Duration} from "@js-joda/core";
import {mathWrapper} from "../interfaces/wrapper-interfaces";
import {MatChip, MatChipListbox, MatChipOption, MatChipSet} from "@angular/material/chips";
import {getTemplateId} from "@angular/compiler-cli/src/ngtsc/typecheck/diagnostics";
import {Constants} from "../constants";
import {JournalService} from "../services/journal.service";
import {ErrorHandlerService} from "../services/error-handler.service";

@Component({
  selector: 'app-template-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TemplateNavComponent, MatToolbar, MatLabel, MatIconButton, MatIcon,
    MatButton, MatCard, MatCardHeader, MatCardContent, MatExpansionPanel, MatExpansionPanelHeader, MatList, MatListItem,
    MatTooltip, MatDivider, MatChipListbox, MatChipOption, MatCardMdImage, NgOptimizedImage, MatChip, MatChipSet],
  templateUrl: './template-view.html',
  styleUrl: './template-view.scss'
})
export class TemplateViewComponent implements OnInit, AfterViewInit {

  //Move data to service. Implement getter
  template: CompleteTemplate | undefined;
  templateResponse!: Observable<CompleteTemplate>;
  errorBody!: ErrorResponse | undefined;

  navInit: NavDetails | undefined;

  totalMinEstimate: number = 0;
  totalMaxEstimate: number = 0;
  totalEstimate: null | string = null;

  liked: boolean | null = null;
  branchable: boolean = true;
  nonBranchableMessage: string = "";

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private templateService: TemplateService,
              private journalService: JournalService, private errorHandler: ErrorHandlerService) {
    
    //this.route.paramMap.subscribe(params => this.templateId = params.get('id'));
  };

  async ngOnInit() {
    const templateId = this.route.snapshot.paramMap.get('id')!;
    //const retrieved: CompleteTemplate | null = JSON.parse(localStorage.getItem("template_" + templateId)!);
    //if (retrieved === null) {
    await this.getCompleteTemplate(templateId);
    //} else {
    //  this.template = retrieved;
    //}

    this.navInit = {
      title: this.template!.title,
      steps: this.templateService.extractTitlesFromSteps(this.template?.steps!),
      type: TEMPLATE_TYPE.DRAFT
    };

    this.templateService.getBranchAvailability(templateId)
      .subscribe(result => {
        
        this.branchable = result;
        if (!this.branchable) {
          this.setNonBranchableMessage();
          
        }
      });
  }

  ngAfterViewInit(): void {
    const minEstimate = this.templateService.convertDurationToString(this.totalMinEstimate, (x) => Math.floor(x));
    const maxEstimate = this.templateService.convertDurationToString(this.totalMaxEstimate, (x) => Math.ceil(x));

    if (minEstimate !== maxEstimate) {
      this.totalEstimate = this.templateService.convertDurationToString(this.totalMinEstimate, (x) => Math.floor(x))
        + " ~ " + this.templateService.convertDurationToString(this.totalMaxEstimate, (x) => Math.ceil(x));
    } else {
      this.totalEstimate = "~" + minEstimate;
    }
  }

  async getCompleteTemplate(templateId: string) {
    this.template = await firstValueFrom(this.templateService.getCompleteTemplate(templateId)
      .pipe(catchError(this.errorHandler.handleErrorResponse.bind(this))));
  }

  handleErrorResponse(error: HttpErrorResponse) {
    this.errorBody = error.error;
    if (error.status == 403) {
      this.router.navigate(["/unknown"]);
    }
    return throwError(() => new Error(error.error.messages[0]));
  }

  calcApprovalPercent(approvals: number, engagements: number) {
    return this.templateService.calcApprovalPercent(approvals, engagements);
  }

  determineBranchStatus() {
    return this.templateService.determineBranchStatus();
  }

  async toBranchTemplate() {
    const createdDraft: TemplateDraft = await firstValueFrom(this.templateService.createDraftFromCompleteTemplate(this.template?.id!));
    localStorage.setItem("Draft: " + createdDraft.id, JSON.stringify({parentCategory: this.template?.category}));
    await this.router.navigate(["templates/myDrafts/" + createdDraft.id], {state: {draft: createdDraft}});
  }

  async trackTemplate() {
    const id = this.template!.id;
    const response = await firstValueFrom(this.journalService.createJournal(id));
    
    if (response.status === 204) {
      const locationHeader = response.headers.get("Location");
      await this.router.navigate([locationHeader]);
    } else if (response.status === 200) {
      await this.router.navigate(["/templates/journal/" + id]);
    }
  }

  setOutline(step: Step): string | null {
    if (step.important) {
      return "3px dashed #d60015"
    }
    return null;
  }

  getTimeEstimateString(step: Step): string {
    const minSeconds = Duration.parse(step.minTimeEstimate).seconds();
    const maxSeconds = Duration.parse(step.maxTimeEstimate).seconds();

    this.totalMinEstimate += minSeconds;
    this.totalMaxEstimate += maxSeconds;

    return this.templateService.convertDurationToString(minSeconds, (x) => Math.floor(x)) + " - "
      + this.templateService.convertDurationToString(maxSeconds, (x) => Math.floor(x));
  }

  getConvertedDate(date: Date) {
    const convertedDate = new Date(date);
    const month = convertedDate.getMonth();
    const day = convertedDate.getDay();

    return "" + convertedDate.getFullYear() + "/"
      + (month < 10 ? "0" + month : month) + "/"
      + (day < 10 ? "0" + day : day);
  }

  parentIsVisible(): boolean {
    const parentDetails = this.template?.parentDetails;
    if (parentDetails === null) {
      return false;
    }

    if (parentDetails?.visibleToOthers === false) {
      const userDetails = localStorage.getItem("userDetails");
      if (userDetails !== null) {
        const loggedInUser = JSON.parse(userDetails).username;
        return loggedInUser === this.template?.creatorName;
      }
      return false;
    }

    return true;
  }

  setNonBranchableMessage() {
    switch (this.template!.branchPermission) {
      case "NONE":
        this.nonBranchableMessage = "The creator has not allowed branching from this template";
        break;
      case "REQUEST_ONLY":
        this.nonBranchableMessage = "You must request permission from the creator in order to branch from this template";
        break;
      case "FRIENDS_ONLY":
        this.nonBranchableMessage = "The creator has allowed branching from this template only to users on their friends list";
        break;
      case "GROUP_ONLY":
        this.nonBranchableMessage = "The creator has allowed branching from this template only to users of the same group";
        break;
    }
  }

  working(nav: string) {
    const element = document.getElementById(nav)!; // Your target element
    const headerOffset = 70;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({top: offsetPosition})
    //document.getElementById(nav)!.scrollIntoView(true);
  }

  async updateApprovals(approval: boolean) {
    await firstValueFrom(this.templateService.updateApproval(this.template?.id!, approval));
    if (this.liked === approval) {
      this.liked = null;
    } else {
      this.liked = approval;
    }
    this.getCompleteTemplate(this.template?.id!);
  }

  setSelectedApproval(approved: boolean) {
    if (approved === this.liked) {
      return "2px solid white"
    }
    return null;
  }

}
