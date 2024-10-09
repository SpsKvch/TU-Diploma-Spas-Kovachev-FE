import {AfterContentInit, Directive, Input, OnInit} from '@angular/core';
import {param} from "jquery";
import {Step} from "./interfaces/template-interfaces";

@Directive({
  selector: '[appResizeImage]',
  standalone: true
})
export class ResizeImageDirective implements AfterContentInit {

  @Input('inputTextFilter') params!: Step;

  constructor() { }

  ngAfterContentInit(): void {
  }


}
