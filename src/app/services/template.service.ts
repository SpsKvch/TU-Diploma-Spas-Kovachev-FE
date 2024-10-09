import {Injectable} from '@angular/core';
import {Duration} from '@js-joda/core';
import {Observable} from 'rxjs';
import {Constants} from '../constants';
import {
  CategoryDetails,
  CompleteTemplate,
  CompleteTemplatePage,
  CompleteTemplateRequest,
  CreateStepForm,
  CreateStepRequest,
  Step,
  TemplateDraft,
  TemplateDraftRequest,
  TemplateJournal
} from '../interfaces/template-interfaces';
import {mathWrapper} from "../interfaces/wrapper-interfaces";
import {RequestService} from "./request.service";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  template!: CompleteTemplate | undefined;

  constructor(private requestService: RequestService) {
  }

  createBlankDraft(): TemplateDraft {
    return {
      id: "",
      title: "New Template",
      content: "",
      imageUrl: null,
      creatorName: null,
      creationDate: null,
      lastUpdateTime: null,
      parentTemplateId: null,
      requirements: [{
        content: "First requirement",
        group: "",
        optional: false
      }],
      steps: [{
        title: "First step",
        content: "",
        imageUrl: null,
        maxTimeEstimate: "PT15M",
        minTimeEstimate: "PT5M",
        important: false,
        optional: false
      }]
    };
  }


  getCompleteTemplate(templateId: string): Observable<CompleteTemplate> {
    return this.requestService.getProtectedEndpoint<CompleteTemplate>(Constants.completeTemplateUrl + templateId, {});
  }

  setCompleteTemplate(template: CompleteTemplate) {
    this.template = template;
  }

  getTemplates() {
    const url = Constants.templateServiceHost + "/v1/templates/complete";
    return this.requestService.getProtectedEndpoint<CompleteTemplatePage>(url, {});
  }

  getTemplateFiltered(filters: any) {
    return this.requestService.getProtectedEndpoint<CompleteTemplatePage>(Constants.templateServiceHost + "/v1/templates/complete/filtered",
      {"filters": JSON.stringify(filters)})
  }

  getTemplateDraft(id: string): Observable<TemplateDraft> {
    const url = Constants.templateDraftUrl + "/" + id
    return this.requestService.getProtectedEndpoint<TemplateDraft>(url, null);
  }

  getJournal(id: string, ownerName: string): Observable<TemplateJournal> {
    return this.requestService.getProtectedEndpoint<TemplateJournal>(Constants.templateJournalUrl.replace('%', id),
      {"ownerName": ownerName})
  }

  updateTemplateDraft(id: string, request: TemplateDraftRequest): Observable<any> {
    return this.requestService.putProtectedEndpoint(Constants.templateDraftUrl + "/" + id, request);
  }

  createNewDraft(request: TemplateDraftRequest): Observable<TemplateDraft> {
    return this.requestService.postProtectedEndpoint(Constants.templateDraftUrl, request, {});
  }

  createDraftFromCompleteTemplate(templateId: string): Observable<TemplateDraft> {
    const url = Constants.branchDraftUrl.replace(Constants.ID, templateId);
    return this.requestService.postProtectedEndpoint<TemplateDraft>(url, null, {});
  }

  deleteDraft(draftId: string) {
    const url = Constants.deleteDraftUrl + draftId;
    return this.requestService.deleteProtectedEndpoint<Boolean>(url);
  }

  completeTemplate(draftId: string, request: CompleteTemplateRequest): Observable<CompleteTemplate> {
    const url = Constants.templateDraftUrl + "/" + draftId + "/complete";
    return this.requestService.postProtectedEndpoint<CompleteTemplate>(url, request, {})
  }

  getBranchAvailability(templateId: string): Observable<boolean> {
    return this.requestService.getProtectedEndpoint(Constants.completeTemplateUrl + templateId + "/branch", {});
  }

  public getCategories() {
    return this.requestService.getProtectedEndpoint<CategoryDetails[]>(Constants.categoriesUrl, {});
  }

  calcApprovalPercent(approvals: number, engagements: number) {
    if (approvals === 0 && engagements === 0) {
      return "N/A";
    } else if (approvals > 0) {
      return ((approvals / engagements) * 100) + "%";
      //return 100 - ((response.disapprovals / response.approvals) * 100) + "%";
    }
    return "0%"
  }

  determineBranchStatus() {
    if (this.template?.parentDetails === null) {
      return "Original";
    } else {
      return "Branched from: " + this.template?.parentDetails.parentId;
    }
  }

  buildCreateStepRequests(stepsForm: CreateStepForm[]): CreateStepRequest[] {
    var stepRequests: CreateStepRequest[] = [];
    for (let step of stepsForm) {
      stepRequests.push(
        {
          title: step.title,
          content: step.content,
          imageUrl: step.imageUrl,
          minTimeEstimate: Duration.of(step.minTimeEstimate.duration,
            UtilsService.parseChronoStringValue(step.minTimeEstimate.timeframe.value)).toString(),
          maxTimeEstimate: Duration.of(step.maxTimeEstimate.duration,
            UtilsService.parseChronoStringValue(step.maxTimeEstimate.timeframe.value)).toString(),
          important: step.important,
          optional: step.optional
        }
      );
    }
    return stepRequests;
  }

  extractTitlesFromSteps(steps: Step[]): string[] {
    const titles: string[] = [];
    steps.forEach((step) => titles.push(step.title));
    return titles;
  }

  extractTitlesFromStepForm(stepsForm: CreateStepForm[]): string[] {
    const titles: string[] = [];
    stepsForm.forEach((step) => titles.push(step.title));
    return titles;
  }

  public redirectToCreatedTemplate(templateId: string) {
    this.requestService.redirect("templates/" + templateId)
  }

  public updateApproval(id: string, like: boolean): Observable<any> {
    const url = Constants.completeTemplateUrl + id + "/approve";
    return this.requestService.patchProtectedEndpoint<any>(url, null,
      {"approved": like});
  }

  convertDurationToString(seconds: number, calc: mathWrapper) {
    //Days
    if (seconds >= 86400) {
      return "" + calc(seconds / 86400) + " Days";
    }
    //Hours
    else if (seconds >= 3600) {
      return "" + calc(seconds / 3600) + " Hrs";
    }
    //Minutes
    return "" + calc(seconds / 60) + " Mins";
  }

}
