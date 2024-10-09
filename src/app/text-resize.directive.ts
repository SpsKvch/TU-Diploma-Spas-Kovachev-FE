import { Directive, Host, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTextResize]',
  standalone: true
})
export class TextResizeDirective {

  @Input() text: string | undefined;
 
  constructor() { }

  @HostListener("mouseenter", ["$event.target"])
  onTextChange(el: HTMLElement) {
  }

}
