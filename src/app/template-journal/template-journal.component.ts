import {Component, OnInit} from '@angular/core';
import {CompleteTemplate, ProgressionStatus, Requirement, TemplateJournal, TrackedStep} from "../interfaces/template-interfaces";
import {TemplateService} from "../services/template.service";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {TemplateViewComponent} from "../template-view/template-view.component";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatTooltip} from "@angular/material/tooltip";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {ChronoUnit, Duration} from "@js-joda/core";
import {MatButton} from "@angular/material/button";
import {JournalService} from "../services/journal.service";
import {UtilsService} from "../services/utils.service";

@Component({
  selector: 'app-template-journal',
  standalone: true,
  imports: [
    NgIf,
    TemplateViewComponent,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatInput,
    MatFormField,
    CdkTextareaAutosize,
    MatLabel,
    NgForOf,
    MatCheckbox,
    MatTooltip,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatButton,
    NgOptimizedImage
  ],
  templateUrl: './template-journal.component.html',
  styleUrl: './template-journal.component.scss'
})
export class TemplateJournalComponent implements OnInit {

  ignoreAbandoned: boolean = false;
  deleteOnConversion: boolean = false;
  templateId!: string;
  template!: CompleteTemplate;
  journal!: TemplateJournal;

  stepsToUpdate: Set<number> = new Set;

  journalRequestForm!: FormGroup;
  requirementsForm!: FormArray;
  stepsForm!: FormArray;

  progressionStatusValues: string[] = [ProgressionStatus.NOT_STARTED.toString(), ProgressionStatus.IN_PROGRESS.toString(),
    ProgressionStatus.ABANDONED.toString(), ProgressionStatus.COMPLETED.toString()]
  timeframeValues = [ChronoUnit.MINUTES.toString(), ChronoUnit.HOURS.toString(), ChronoUnit.DAYS.toString()];

  constructor(private templateService: TemplateService, private formBuilder: FormBuilder,
              private journalService: JournalService, private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(val => {
      this.templateId = val.get("id")?.toString()!
    });

    this.template = await firstValueFrom(this.templateService.getCompleteTemplate(this.templateId));
    this.journal = await firstValueFrom(this.templateService.getJournal(this.templateId, this.getOwnerName()));
    console.log(this.journal)

    let journalRequirements: Requirement[] | null = this.journal?.trackedRequirements;
    
    this.requirementsForm = this.buildRequirementsForm((journalRequirements === null || journalRequirements.length == 0)
      ? this.template?.requirements! : journalRequirements);
    this.stepsForm = this.buildStepsForm(this.journal?.trackedSteps!);

    this.journalRequestForm = this.formBuilder.group({
      title: this.getJournalTitle(),
      content: this.journal.markedUpContent,
      markedUpImage: this.journal.markedUpImage,
      requirements: this.requirementsForm,
      steps: this.stepsForm,
      newStatus: this.journal.currentStatus
    });
  }

  updateJournal() {
    this.journalService.updateJournal(this.journal.id, this.journalRequestForm, this.stepsToUpdate);
  }

  convertToDraft() {
    this.journalService.convertToDraft(this.journal.id, this.ignoreAbandoned, this.deleteOnConversion);
  }

  getJournalTitle(): string {
    const journalTitle: string | null = this.journal.newTitle;
    if (journalTitle !== null && journalTitle!.length > 0) {
      return journalTitle!;
    }
    
    return this.template.title + ' Journal';
  }

  getOwnerName() {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails !== null) {
      return JSON.parse(userDetails).username;
    }
    return "";
  }

  buildRequirementsForm(requirements: Requirement[]): FormArray {
    let reqArr: FormArray = this.formBuilder.array([]);
    requirements.forEach(req => {
      let group = this.formBuilder.group({
        content: req.content,
        group: req.group,
        optional: req.optional
      });
      reqArr.push(group);
    });
    
    return reqArr;
  }

  buildStepsForm(steps: TrackedStep[]): FormArray {
    let stepArr: FormArray = this.formBuilder.array([]);
    let counter = 0;
    steps.forEach(step => {
      
      let group = this.formBuilder.group({
        title: step.markedUpTitle,
        content: step.markedUpContent,
        markedUpImage: step.markedUpImage,
        notes: step.notes,
        progressionStatus: ProgressionStatus[step.progressionStatus],
        timeSpentDuration: this.formBuilder.group(UtilsService.createDurationForm(step.timeSpent))
      });
      stepArr.push(group);
      const currentCounter = counter;
      group.valueChanges.subscribe(result => {
        this.stepsToUpdate.add(currentCounter);
        console.log(this.stepsToUpdate)
      });
      counter++;
    });
    return stepArr;
  }

  getOptionalTooltip(req: Requirement) {
    
    if (req.optional) {
      return 'Optional requirement';
    }
    return '';
  }

  protected readonly ProgressionStatus = ProgressionStatus;
}
