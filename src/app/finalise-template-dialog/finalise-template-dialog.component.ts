import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {
  CategoryDetails,
  CompleteTemplate,
  CompleteTemplateRequest, ErrorResponse,
  TemplateDraftRequest
} from "../interfaces/template-interfaces";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {
  MatChipEditedEvent,
  MatChipGrid, MatChipInput,
  MatChipInputEvent,
  MatChipListbox,
  MatChipOption, MatChipRemove,
  MatChipRow
} from "@angular/material/chips";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatIcon} from "@angular/material/icon";
import {TemplateService} from "../services/template.service";
import {firstValueFrom} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-finalise-template-dialog',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose,
    ReactiveFormsModule, MatSelect, MatOption, NgForOf, MatChipListbox, MatChipOption, NgIf, MatCard, MatCardHeader,
    MatCardContent, MatChipGrid, MatChipRow, MatIcon, MatChipInput, MatChipRemove, MatProgressSpinner],
  templateUrl: './finalise-template-dialog.component.html',
  styleUrl: './finalise-template-dialog.component.css'
})
export class FinaliseTemplateDialogComponent {

  finalizeTemplateForm!: FormGroup;
  loadedTags: string[] | undefined;
  selectedUsers: string[] = [];
  errorMessage: string | undefined | null;
  spinnerActive: boolean = false;

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  constructor(public dialogRef: MatDialogRef<FinaliseTemplateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private formBuilder: FormBuilder, private templateService: TemplateService) {
    
    this.finalizeTemplateForm = this.formBuilder.group({
      category: "",
      tags: [],
      permission: BranchPermission.ALL,
      status: AccessStatus.PUBLIC,
      sharedWith: []
    });
  }

  async finaliseTemplateCreation() {
    this.spinnerActive = true;
    const completeTemplateRequest = this.buildCompleteTemplateRequest();
    
    try {
      const completeTemplate: CompleteTemplate =
        await firstValueFrom(this.templateService.completeTemplate(this.data.draftId, completeTemplateRequest));
      this.templateService.redirectToCreatedTemplate(completeTemplate.id);
      this.dialogRef.close();
    } catch (e: any) {
      
      const statusCode: number = e.status;
      const errorResponse: ErrorResponse = e.error;
      if (statusCode != 500) {
        this.errorMessage = errorResponse.messages[0];
      } else {
        this.errorMessage = "Oops. Something went wrong. Please try again."
      }
      
      this.spinnerActive = false;
    }
  }

  closeDialog() {
    this.errorMessage = null;
    this.dialogRef.close();
  }

  buildCompleteTemplateRequest(): CompleteTemplateRequest {
    const selectedCategory = this.finalizeTemplateForm.controls['category'].value;
    const accessStatusKey = Object.keys(AccessStatus)[Object.values(AccessStatus)
      .indexOf(this.finalizeTemplateForm.controls['status'].value)];
    const branchPermissionKey = Object.keys(BranchPermission)[Object.values(BranchPermission)
      .indexOf(this.finalizeTemplateForm.controls['permission'].value)];

    return {
      categoryId: this.extractIdFromSelectedCategory(selectedCategory),
      tags: this.finalizeTemplateForm.controls['tags'].value,
      accessStatus: accessStatusKey,
      branchPermission: branchPermissionKey,
      sharedWith: this.finalizeTemplateForm.controls['sharedWith'].value,
    }
  }

  getCategoryNames(): string[] {
    var categoryNames: string[] = [];
    this.data.categories.forEach((cat) => categoryNames.push(cat.categoryName));
    return categoryNames;
  }

  setCategoryTags(category: string) {
    const selectedCategory = this.data.categories.find(x => x.categoryName === category);
    this.loadedTags = selectedCategory!.childTags;
    
    
  }

  extractIdFromSelectedCategory(selectedCategory: string) {
    const categories = this.data.categories;
    return categories.find(category => category.categoryName === selectedCategory)!.id;
  }

  getBranchPermissionValues() {
    const userFriendlyVals = []
    const allValues = Object.values(BranchPermission);
    for (let i = 0; i < allValues.length; i += 2) {
      userFriendlyVals.push(allValues[i])
    }
    return userFriendlyVals;
  }

  getAccessStatusValues() {
    const userFriendlyVals = []
    const allValues = Object.values(AccessStatus);
    for (let i = 0; i < allValues.length; i += 2) {
      userFriendlyVals.push(allValues[i])
    }
    return userFriendlyVals;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedUsers.push(value);
    }

    event.chipInput!.clear();
  }

  remove(user: string): void {
    const index = this.selectedUsers.indexOf(user);

    if (index >= 0) {
      this.selectedUsers.splice(index, 1);

    }
  }

  edit(user: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(user);
      return;
    }

    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers[index] = value;
    }
  }

}

interface DialogData {
  draftId: string,
  categories: CategoryDetails[]
}

enum BranchPermission {
  NONE = <any>"None",
  REQUEST_ONLY = <any>"Requested Only",
  FRIENDS_ONLY = <any>"Friends Only",
  GROUP_ONLY = <any>"Group Only",
  ALL = <any>"All"
}

enum AccessStatus {
  PERSONAL = <any>"Personal",
  PRIVATE = <any>"Private",
  GROUP = <any>"Group",
  PUBLIC = <any>"Public"
}
