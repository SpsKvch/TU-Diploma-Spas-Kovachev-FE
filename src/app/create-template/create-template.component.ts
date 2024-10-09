import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ChronoUnit, Duration} from '@js-joda/core';
import {firstValueFrom} from 'rxjs';
import {
  CategoryDetails,
  CompleteTemplate,
  CreateStepForm,
  CreateStepRequest,
  NavDetails,
  Requirement,
  Step,
  TEMPLATE_TYPE,
  TemplateDraft,
  TemplateDraftRequest
} from '../interfaces/template-interfaces';
import {TemplateService} from '../services/template.service';

import {ActivatedRoute, Router} from '@angular/router';
import {TemplateNavComponent} from '../template-nav/template-nav.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatDivider} from "@angular/material/divider";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatDialog} from "@angular/material/dialog";
import {FinaliseTemplateDialogComponent} from "../finalise-template-dialog/finalise-template-dialog.component";
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCard, MatCardHeader, MatCardMdImage} from "@angular/material/card";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {UtilsService} from "../services/utils.service";
import {Constants} from "../constants";
import {AddImageDialogComponent} from "../add-image-dialog/add-image-dialog.component";
import {ResizeImageDirective} from "../resize-image.directive";

@Component({
  selector: 'app-create-template',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TemplateNavComponent, MatSliderModule,
    MatButtonModule, MatIconModule, MatCheckboxModule, MatExpansionModule, MatFormFieldModule, MatSelectModule,
    MatInput, CdkTextareaAutosize, MatDivider, CdkDropList, CdkDrag, MatCard, MatCardHeader, MatSidenav,
    MatSidenavContainer, MatSidenavContent, CdkDragPlaceholder, NgOptimizedImage, ResizeImageDirective, MatCardMdImage],
  templateUrl: "./template-material.html",
  styleUrl: './template-material.scss'
})
export class CreateTemplateComponent implements OnInit {

  draftId!: string;
  templateDraft: TemplateDraft | null = null;
  static loaded: boolean = false;
  complete = false;
  @ViewChild("selectPanel") panel!: ElementRef;

  template: CompleteTemplate | undefined = this.templateService.template;
  draftRequestForm!: FormGroup;
  requirementsForm!: FormArray;
  stepsForm!: FormArray;

  categories!: CategoryDetails[];

  timeframeValues = [ChronoUnit.MINUTES.toString(), ChronoUnit.HOURS.toString(), ChronoUnit.DAYS.toString()];

  draggingDisabled = false;
  updateDraftErrorMessage: string | undefined | null;

  navInit: NavDetails | undefined;

  @ViewChildren('stepArray') attendeeInputs!: QueryList<ElementRef>;

  constructor(private templateService: TemplateService, private formBuilder: FormBuilder,
              private router: Router, private route: ActivatedRoute, private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(val => this.draftId = val.get("id")?.toString()!);

    if (this.draftId === Constants.NEW_DRAFT_FLAG) {
      this.templateDraft = this.templateService.createBlankDraft();
    } else if (this.templateDraft === null) {
      this.templateDraft = await firstValueFrom(this.templateService.getTemplateDraft(this.draftId));
      
    }

    this.categories = await firstValueFrom(this.templateService.getCategories());

    this.requirementsForm = this.buildRequirementsForm(this.templateDraft?.requirements!);
    this.stepsForm = this.buildStepsForm(this.templateDraft?.steps!);

    this.navInit = {
      title: this.templateDraft.title,
      steps: this.templateService.extractTitlesFromStepForm(this.stepsForm.value),
      type: TEMPLATE_TYPE.DRAFT
    };

    this.draftRequestForm = this.formBuilder.group({
      title: this.templateDraft?.title,
      content: this.templateDraft?.content,
      imageUrl: this.templateDraft?.imageUrl,
      requirements: this.requirementsForm,
      steps: this.stepsForm
    });

    this.draftRequestForm.controls['title'].valueChanges
      .subscribe((title) => this.navInit!.title = <string>title);
    this.stepsForm.valueChanges.subscribe((steps) => this.navInit!.steps = this.templateService.extractTitlesFromStepForm(steps));
  }

  openDialog(): void {
    const categories = this.categories;
    const draftId = this.draftId;

    const dialogRef = this.dialog.open(FinaliseTemplateDialogComponent, {
      data: {draftId, categories}, height: "600px", width: "50%", disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      
      
    });
  }

  openImageDialog(): void {
    const dialogRef = this.dialog.open(AddImageDialogComponent, { width: "50%" });

    dialogRef.afterClosed().subscribe(result => {
      this.draftRequestForm!.get('imageUrl')?.setValue(result);
    });
  }

  removeImage() {
    this.draftRequestForm!.get('imageUrl')?.setValue(null);
  }

  openImageDialogForStep(index: number): void {
    const dialogRef = this.dialog.open(AddImageDialogComponent, { width: "50%" });

    dialogRef.afterClosed().subscribe(result => {
      this.stepsForm!.at(index).get('imageUrl')?.setValue(result);
    });
  }

  removeImageFromStep(index: number) {
    this.stepsForm!.at(index).get('imageUrl')?.setValue(null);
  }

  getMinTimeEstimate(index: number) {
    return this.stepsForm.controls[index].get('minTimeEstimate') as FormGroup;
  }

  getMinTimeEstimateControl(index: number) {
    return (this.stepsForm.controls[index].get('minTimeEstimate') as FormGroup).controls['duration'] as FormControl;
  }

  getMaxTimeEstimateControl(index: number) {
    return (this.stepsForm.controls[index].get('maxTimeEstimate') as FormGroup).controls['duration'] as FormControl;
  }

  getMaxTimeEstimate(index: number) {
    return this.stepsForm.controls[index].get('maxTimeEstimate') as FormGroup;
  }

  async saveDraft() {
    const draftRequest: TemplateDraftRequest = this.buildDraftRequest();
    
    try {
      if (this.draftId === Constants.NEW_DRAFT_FLAG) {
        await firstValueFrom(this.templateService.createNewDraft(draftRequest))
          .then(result => {
            
            this.router.navigate(["/templates/myDrafts/" + result.id]);
          })
      }
      await firstValueFrom(this.templateService.updateTemplateDraft(this.draftId!, draftRequest));
      this.updateDraftErrorMessage = null;
      this.snackBar.open("Draft updated successfully!", "Close")
    } catch (e: any) {
      this.updateDraftErrorMessage = e.error.messages[0];
    }
  }

  draftIsNew() {
    return this.draftId === Constants.NEW_DRAFT_FLAG;
  }

  async deleteDraft() {
    
    this.templateService.deleteDraft(this.draftId).subscribe(deleted => {
      if (deleted) {
        this.router.navigate(["/home"]);
      } else {
        this.snackBar.open("Unable to delete draft");
      }
    });
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

  buildStepsForm(steps: Step[]): FormArray {
    let stepArr: FormArray = this.formBuilder.array([]);
    steps.forEach(step => {
      let group = this.formBuilder.group({
        title: step.title,
        content: step.content,
        imageUrl: step.imageUrl,
        minTimeEstimate: this.formBuilder.group(UtilsService.createDurationForm(step.minTimeEstimate)),
        maxTimeEstimate: this.formBuilder.group(UtilsService.createDurationForm(step.maxTimeEstimate)),
        important: step.important,
        optional: step.optional
      });
      stepArr.push(group);
    });
    return stepArr;
  }

  private buildDraftRequest(): TemplateDraftRequest {
    const reorderedSteps: CreateStepForm[] = [];
    this.stepsForm.controls.forEach(step => reorderedSteps.push(step.value));
    
    return {
      title: this.draftRequestForm.controls["title"].value,
      content: this.draftRequestForm.controls["content"].value,
      imageUrl: this.draftRequestForm.controls["imageUrl"].value,
      requirements: this.draftRequestForm.controls["requirements"].value,
      steps: this.templateService.buildCreateStepRequests(reorderedSteps)
    }
  }

  insertRequirement(event: any) {
    event.stopPropagation();
    let group = this.formBuilder.group({
      content: "New Requirement",
      optional: false
    })
    this.requirementsForm.insert(this.requirementsForm.length, group);
  }

  removeRequirement(index: number) {
    if (this.requirementsForm.length > 1) {
      this.requirementsForm.removeAt(index);
    } else {
      this.snackBar.open("Cannot remove all requirements!");
    }
  }

  insertNewStep(event: any, index: number) {
    event.stopPropagation();

    let group = this.formBuilder.group({
      title: 'New Step',
      content: '',
      minTimeEstimate: this.formBuilder.group(UtilsService.createDurationForm("PT1M")),
      maxTimeEstimate: this.formBuilder.group(UtilsService.createDurationForm("PT1M")),
      important: false,
      optional: false
    });
    this.stepsForm.insert(index + 1, group);
  }

  removeStep(index: number) {
    if (this.stepsForm.length > 1) {
      this.stepsForm.removeAt(index);
      this.snackBar.open("Step " + (index + 1) + " removed");
    } else {
      this.snackBar.open("Cannot remove all steps!");
    }
  }

  logInfo(event: any, x: any) {
    event.stopPropagation();
    this.attendeeInputs.forEach(x => console.log(x))
    
  }

  getTitle(x: number) {
    const req: CreateStepRequest = this.stepsForm.at(x).value;
    return req.title;
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.stepsForm.controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.navInit!.steps, event.previousIndex, event.currentIndex);
  }

  disableDragging() {
    this.draggingDisabled = true;
  }

  enableDragging() {
    this.draggingDisabled = false;
  }

  working(nav: string) {
    const element = document.getElementById(nav)!; // Your target element
    const headerOffset = 70;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({top: offsetPosition})
    //document.getElementById(nav)!.scrollIntoView(true);
  }

}
