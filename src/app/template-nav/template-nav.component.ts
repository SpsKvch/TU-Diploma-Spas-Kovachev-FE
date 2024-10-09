import {Component, EventEmitter, Injectable, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {CompleteTemplate, GenericTemplate, NavDetails, TEMPLATE_TYPE} from "../interfaces/template-interfaces";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CommonModule, NgIf} from "@angular/common";
import {MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {NavDraftEventWrapper} from "../interfaces/wrapper-interfaces";
import {BehaviorSubject} from "rxjs";

@Injectable()
@Component({
  selector: 'app-template-nav',
  standalone: true,
  imports: [
    MatSidenav,
    MatSidenavContainer,
    NgIf,
    MatLabel,
    RouterLink,
    MatButton,
    MatDivider,
    CommonModule
  ],
  templateUrl: './template-nav.component.html',
  //styleUrl: './template-nav.component.css'
  styleUrl: './template-nav.scss'
})
export class TemplateNavComponent implements OnInit, OnChanges{

  completeTemplate: CompleteTemplate | undefined;
  @Input() templateDetails: NavDetails | null | undefined = null;
  //template = new BehaviorSubject<GenericTemplate | null | undefined>(null);
  //@Input() context: NavDetails | undefined;

  @Output() navEvent = new EventEmitter<string>();

  constructor(private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.completeTemplate = JSON.parse(localStorage.getItem("template_"+id)!);
    
    
  }

  ngOnInit(): void {
    
    //this.templateDetails= this.context?.content;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.context = changes['context'].currentValue;
    //this.template.asObservable();
    //this.template.next(this.context?.content);
    //this.templateDetails= this.context?.content;
    
  }

  // templateObservable() {
  //   return this.template.asObservable() !== null;
  // }

  sendNav(id: string): void {
    this.navEvent.emit(id);
  }

  concatLabel(val: string): string {
    if (val.length > 24) {
      return val.substring(0, 24)+"...";
    }
    return val;
  }

  isCompleteTemplate() {
    return this.templateDetails !== null && this.templateDetails!.type === TEMPLATE_TYPE.COMPLETE;
  }

  // getTemplate(): GenericTemplate {
  //   console.log("Retrieved " + this.template.value)
  //   return this.template.value!;
  // }

}
