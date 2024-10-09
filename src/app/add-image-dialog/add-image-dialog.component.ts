import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatChipGrid, MatChipInput, MatChipListbox, MatChipOption, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatOption} from "@angular/material/autocomplete";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-add-image-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatChipGrid,
    MatChipInput,
    MatChipListbox,
    MatChipOption,
    MatChipRemove,
    MatChipRow,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatIcon,
    MatLabel,
    MatOption,
    MatProgressSpinner,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatInput,
    NgOptimizedImage
  ],
  templateUrl: './add-image-dialog.component.html',
  styleUrl: './add-image-dialog.component.scss'
})
export class AddImageDialogComponent {
  errorMessage: string | undefined | null;
  spinnerActive: boolean = false;
  imageUrl: string | null = null;

  constructor(public dialogRef: MatDialogRef<AddImageDialogComponent>) {
  }

  omitCharacters(event: any) {
    var k = event.keyCode;
    return k != 32;
  }

  checkImage(event: any) {
    this.errorMessage = null;
    this.imageUrl = event.target.value;
    var img = new Image();
    img.src = this.imageUrl!;
    img.onload = (event: Event) => {
      let  loadedImage = <any>event.currentTarget;
      let width = loadedImage.width;
      let height = loadedImage.height;
    }
  }

  validateImage() {
    
    this.errorMessage = "Invalid image URL!"
    this.imageUrl = null;
  }

  closeDialog() {
    this.errorMessage = null;
    this.dialogRef.close(this.imageUrl);
  }

}
