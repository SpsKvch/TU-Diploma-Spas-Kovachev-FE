import {Injectable} from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";
import {ProgressionStatus, Requirement, TemplateJournal, TrackedStepRequest, UpdateJournalRequest} from "../interfaces/template-interfaces";
import {ChronoUnit, Duration, TemporalUnit} from "@js-joda/core";
import {UtilsService} from "./utils.service";
import {RequestService} from "./request.service";
import {Constants} from "../constants";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(private requestService: RequestService) {
  }

  public createJournal(templateId: string) {
    const url = Constants.createJournalUrl.replace(Constants.ID, templateId);
    
    return this.requestService.observePostEndpointResponse<any>(url);
  }

  public async updateJournal(id: string, journalForm: FormGroup, stepsToUpdate: Set<number>) {
    const url = Constants.updateTemplateJournalUrl + id;
    const request = this.buildUpdateJournalRequest(journalForm, stepsToUpdate);
    
    await firstValueFrom(this.requestService.putProtectedEndpoint(url, request));
  }

  public convertToDraft(id: string, ignoreAbandoned: boolean, deleteOnConversion: boolean) {
    const url = Constants.templateDraftUrl + id;
    firstValueFrom(this.requestService.postProtectedEndpoint(url, null,
      {"ignoreAbandoned": ignoreAbandoned, "deleteOnCreation": deleteOnConversion}))
      .then(result => {
        console.log(result)
        const parsedResult = <any>result;
        this.requestService.redirect("/templates/myDrafts/" + parsedResult.id);
      })
  }

  public async getAllJournalsForUser(username: string) {
   // const currentUser = UtilsService.getUserDetails().username;
    const url = Constants.getAllJournalsForUserUrl.replace(Constants.USERNAME, username);
    return firstValueFrom(this.requestService.getProtectedEndpoint<TemplateJournal[]>(url, {}));
  }

  private buildUpdateJournalRequest(journalForm: FormGroup, stepsToUpdate: Set<number>): UpdateJournalRequest {
    return {
      markedUpContent: journalForm.controls["content"].value,
      newStatus: journalForm.controls["newStatus"].value,
      newTitle: journalForm.controls["title"].value,
      markedUpImageUrl: journalForm.controls["markedUpImage"].value,
      trackedRequirements: this.buildRequirementsRequest(journalForm.controls["requirements"].value),
      trackedSteps: this.buildJournalStepRequest(journalForm.controls["steps"].value, stepsToUpdate)
    }
  }

  private buildRequirementsRequest(reqFormArray: FormArray): Requirement[] {
    const requirements: Requirement[] = [];
    
    ((reqFormArray as unknown) as Requirement[]).forEach(control => {
      requirements.push({
        content: control.content,
        group: control.group,
        optional: control.optional
      });
    })
    return requirements;
  }

  private buildJournalStepRequest(stepsFormArray: FormArray, affectedSteps: Set<number>): any {
    const stepsRequestRecord: Record<number, TrackedStepRequest> = {};
    const testing: any = {}
    
    for (let i = 0; i < stepsFormArray.length; i++) {
      if (affectedSteps.has(i)) {
        let stepControl: any = ((stepsFormArray as any))[i];
        
        testing["" + i] = {
          title: stepControl.title,
          markedUpContent: stepControl.content,
          notes: stepControl.notes === null ? [] : [stepControl.notes[0]],
          progressionStatus: Object.keys(ProgressionStatus)[Object.values(ProgressionStatus).indexOf(stepControl.progressionStatus)],
          //progressionStatus: ProgressionStatus[stepControl.progressionStatus as ProgressionStatus],
          timeSpent: this.parseTimeSpent(stepControl.timeSpentDuration["duration"], stepControl.timeSpentDuration["timeframe"])
        }
        console.log(testing["" + i])
      }
    }
    console.log(testing)
    return testing;
  }

  private parseTimeSpent(duration: number, unit: string): string {

    if (duration == 0) {
      return "PT0M";
    }
    return Duration.of(duration, UtilsService.parseChronoStringValue(unit)).toString();
  }

}
