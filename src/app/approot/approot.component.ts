import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-approot',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './approot.component.html',
  styleUrl: './approot.component.css'
})
export class ApprootComponent {

}
