import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {RequestService} from "../services/request.service";
import {Constants} from "../constants";
import {first, firstValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatChipEditedEvent, MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    FormsModule,
    MatChipGrid,
    MatChipInput,
    MatChipRemove,
    MatChipRow,
    MatIcon,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {

  templateId: string | null = null;
  categoryName: string | null = null;

  selectedTags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  constructor(private requestService: RequestService, private router: Router) {
  }

  async deleteTemplate() {
    console.log(this.templateId)
    if (this.templateId !== null) {
      await firstValueFrom(this.requestService.deleteProtectedEndpoint(Constants.completeTemplateUrl + this.templateId));
      this.templateId = null;
    }
  }

  async addCategory() {
    console.log(this.categoryName)
    if (this.categoryName !== null) {
      await firstValueFrom(this.requestService.putProtectedEndpoint(Constants.categoriesUrl + "/" + this.categoryName, this.selectedTags));
    }
  }

  async deleteCategory() {
    if (this.categoryName !== null) {
      await firstValueFrom(this.requestService.deleteProtectedEndpoint(Constants.categoriesUrl + "/" + this.categoryName));
      this.categoryName = null;
    }
  }

  async updateCategory() {
    if (this.categoryName !== null && this.selectedTags !== null && this.selectedTags.length > 0) {
      
      await firstValueFrom(this.requestService.patchProtectedEndpoint(Constants.categoriesUrl + "/" + this.categoryName + "/tags", this.selectedTags, null));
      this.selectedTags = [];
    }
  }

  clearTags() {
    this.selectedTags = [];
  }


  private async userHasPermissions() {
    const permissions: string[] = await firstValueFrom(this.requestService.getProtectedEndpoint<string[]>(Constants.getPermissionsUrl, null));
    if (!permissions.includes('admin') && !permissions.includes('root')) {
      await this.router.navigate(["/unknown"]);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedTags.push(value);
    }

    event.chipInput!.clear();
  }

  remove(user: string): void {
    const index = this.selectedTags.indexOf(user);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);

    }
  }

  edit(user: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(user);
      return;
    }

    const index = this.selectedTags.indexOf(user);
    if (index >= 0) {
      this.selectedTags[index] = value;
    }
  }

}
