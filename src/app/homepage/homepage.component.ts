import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import {TemplateService} from "../services/template.service";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {
  CategoryDetails,
  CompleteTemplate,
  CompleteTemplatePage, FiltersRequest, InternalFilters,
  TemplateSearchFilters
} from "../interfaces/template-interfaces";
import {firstValueFrom} from "rxjs";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatChip, MatChipListbox, MatChipOption, MatChipSet} from "@angular/material/chips";
import {TemplatePreviewComponent} from "../template-preview/template-preview.component";
import {MatInput} from "@angular/material/input";
import {MatSlider, MatSliderRangeThumb, MatSliderThumb} from "@angular/material/slider";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOption} from "@angular/material/core";
import {MatButton} from "@angular/material/button";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {ChronoUnit, DateTimeFormatter, Duration, Temporal, TemporalUnit, ZonedDateTime} from "@js-joda/core";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {UtilsService} from "../services/utils.service";

@Component({
  selector: 'app-homepage',
  standalone: true,
  //imports: [RouterModule, RouterLink, RouterLinkActive],
  imports: [CommonModule, FormsModule, RouterLink, MatCard, MatCardHeader, MatCardContent, MatIcon, MatLabel, MatChip,
    MatChipSet, TemplatePreviewComponent, MatFormField, MatInput, MatSlider, MatSliderThumb, MatSliderRangeThumb,
    MatDatepicker, MatHint, MatNativeDateModule, MatDatepickerModule, MatSuffix, MatButton, MatAutocomplete,
    ReactiveFormsModule, MatAutocompleteTrigger, MatOption, MatChipListbox, MatChipOption, MatCheckbox, MatSelectModule, MatPaginator],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit{

  templateId: string = "";
  templates: CompleteTemplate[] = [];
  page: CompleteTemplatePage | undefined;
  categories: CategoryDetails[] = [];
  loadedTags: string[] = [];

  timeframeValues = [ChronoUnit.MINUTES.toString(), ChronoUnit.HOURS.toString(), ChronoUnit.DAYS.toString()];
  completionTimeConstraint: number = 60;
  completionRateEnabled = true;

  filtersForm: FormGroup = new FormGroup<any>({});

  pageSize = 25;

  constructor(private router: Router, private templateService: TemplateService, private formBuilder: FormBuilder) {};

  ngOnInit(): void {
    this.getTemplates();
    
    this.initCategories();

    this.filtersForm = this.formBuilder.group<TemplateSearchFilters>({
      title: "",
      category: "",
      tags: [],
      completionRate: 0,
      maxCompletionTime: 100,
      completionTimePeriod: "Minutes",
      isOriginal: false,
      minApproval: 50,
      minDate: null,
      maxDate: null
    });
  }

  mapToFilterRequest(filtersForm: TemplateSearchFilters): any {
    let request: any = {};
    

    if (filtersForm.title !== null && filtersForm.title !== "") {
      request.title = filtersForm.title;
    } else {
      //request.title = null;
    }

    if (filtersForm.minDate !== null) {
      request.minDate = filtersForm.minDate.toISOString().split("T")[0];
    } else {
      request.minDate = null;
    }

    if (filtersForm.maxDate !== null) {
      request.maxDate = filtersForm.maxDate.toISOString().split("T")[0];
    } else {
      request.maxDate = null;
    }

    if (filtersForm.category !== null && filtersForm.category !== "") {
      request.categoryName = filtersForm.category;
      if (filtersForm.tags !== null && filtersForm.tags.length > 0) {
        request.tags = filtersForm.tags;
      }
    } else {
      //request.categoryName = null;
      //request.tags = [];
    }

    request.isOriginal = filtersForm.isOriginal;
    request.minApprovalPercent = filtersForm.minApproval;

    if (this.completionRateEnabled && filtersForm.maxCompletionTime !== null) {
      request.maxCompletionTime = Duration.of(filtersForm.maxCompletionTime,
        UtilsService.parseChronoStringValue(filtersForm.completionTimePeriod));
    } else {
      request.maxCompletionTime = null;
    }

    if (filtersForm.completionRate > 0) {
      request.minCompletionRate = filtersForm.completionRate;
    } else {
      request.maxCompletionTime = null;
    }

    if (filtersForm.minApproval !== null) {
      request.minApprovalPercent = filtersForm.minApproval;
    } else {
      request.minApprovalPercent = 0;
    }

    if (filtersForm.completionRate !== null) {
      request.minCompletionRate = filtersForm.completionRate;
    } else {
      request.minCompletionRate = 0;
    }

    console.log(request)

    return request;
  }

  async getTemplates() {
    this.page = await firstValueFrom(this.templateService.getTemplates());
    console.log(this.page)
    this.templates = this.page.content.slice(0, this.pageSize);
    
  }

  switchPage(event: PageEvent) {
    let startIndex = event.pageIndex * event.pageSize;
    this.templates = this.page!.content.slice(startIndex, startIndex+this.pageSize);
  }

  async getTemplatesFiltered() {
    this.page = await firstValueFrom(this.templateService.getTemplateFiltered(this.mapToFilterRequest(this.filtersForm.value)));
    console.log(this.page)
  }

  async initCategories() {
    await firstValueFrom(this.templateService.getCategories()).then(categoryResult => this.categories = categoryResult);
  }

  getCategories() {
    return this.categories.map(category => category.categoryName);
  }

  formatCompletionRate(val: number) {
    return val + "%";
  }

  loadTags(category: string) {
    this.loadedTags = this.categories
                          .find(categoryDetails => categoryDetails.categoryName === category)!.childTags;
  }

  createRequest() {
    
  }

  setCompletionTimeConstraint(unit: string) {
    switch (unit) {
      case this.timeframeValues[0]:
        this.completionTimeConstraint = 60;
        break;
      case this.timeframeValues[1]:
        this.completionTimeConstraint = 24;
        break;
      case this.timeframeValues[2]:
        this.completionTimeConstraint = 30;
        break;
    }
  }

  toggleCompletionRate() {
    if (this.completionRateEnabled) {
      this.completionRateEnabled = false;
    } else {
      this.completionRateEnabled = true;
    }
  }

  calcApprovals(approvals: number, engagements: number): string {
    return this.templateService.calcApprovalPercent(approvals, engagements);
  }

  redirectToTemplate() {
    this.router.navigate(["./templates/" + this.templateId]);
  }
}
