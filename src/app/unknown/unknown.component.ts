import { Component } from '@angular/core';
import {TemplateNavComponent} from "../template-nav/template-nav.component";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-unknown',
  standalone: true,
  imports: [
    TemplateNavComponent,
    MatLabel
  ],
  templateUrl: './unknown.component.html',
  styleUrl: './unknown.component.scss'
})
export class UnknownComponent {

}
