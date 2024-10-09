import {Component, Input} from '@angular/core';
import {CompleteTemplate, NavDetails} from "../interfaces/template-interfaces";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatLabel} from "@angular/material/form-field";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {TemplateService} from "../services/template.service";
import {MatDivider} from "@angular/material/divider";
import {MatTooltip} from "@angular/material/tooltip";
import {Duration} from "@js-joda/core";

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCard, MatCardHeader, MatCardContent, MatIcon, MatLabel, MatChip, MatChipSet, MatDivider, MatTooltip],
  templateUrl: './template-preview.component.html',
  styleUrl: './template-preview.component.scss'
})
export class TemplatePreviewComponent {

  CONTENT_PREVIEW_SIZE = 400;

  @Input() template: CompleteTemplate | undefined;

  constructor(private templateService: TemplateService) {
  }

  calcApprovals(approvals: number, engagements: number): string {
    return this.templateService.calcApprovalPercent(approvals, engagements);
  }

  getTruncatedContent() {
    var content = this.template?.content!;
    if (content.length! > this.CONTENT_PREVIEW_SIZE) {
      return content.substring(0, this.CONTENT_PREVIEW_SIZE) + '...';
    }
    return content;
  }

  getTimeString() {
    let aggregateMinTime: number = 0;
    let aggregateMaxTime: number = 0;

    this.template?.steps.forEach(step => {
      aggregateMinTime += Duration.parse(step.minTimeEstimate).seconds();
      aggregateMaxTime += Duration.parse(step.maxTimeEstimate).seconds();
    })

    return this.templateService.convertDurationToString(aggregateMinTime, (x) => Math.floor(x)) + " - "
      + this.templateService.convertDurationToString(aggregateMaxTime, (x) => Math.ceil(x));
  }

  formatDate(): string {
    const datePart: string = this.template!.createTime.toString().split("T")[0];
    const parts: string[] = datePart.split("-");
    return parts[2] + "." + parts[1] + "." + parts[0];
  }

}
