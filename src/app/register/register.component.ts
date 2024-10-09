import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { RegistrationRequest } from '../interfaces/template-interfaces';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCard, MatCardContent, MatCardHeader, MatLabel, MatButton],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit {

  registrationForm!: FormGroup;
  passwordMatchMessage: string = "";

  constructor(private formBulder: FormBuilder, private router: Router, private authService: AuthService) { };

  ngOnInit(): void {
    this.registrationForm = this.formBulder.group(
      {
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
      });
      
  }

  async onSubmit() {
    var password = this.registrationForm.get("password")?.value;
    var confirmedPassword = this.registrationForm.get("confirmPassword")?.value;

    if(password != confirmedPassword) {
      
      this.passwordMatchMessage = "Passwords don't match";
      return;
    } else {
      this.passwordMatchMessage = "";
    }

    var regRequest: RegistrationRequest = {
      authorizationRequest: {
        username: this.registrationForm.get("username")?.value,
        password: password
      },
      createTemplateUserRequest: {
        firstName: this.registrationForm.get("firstName")?.value,
        lastName: this.registrationForm.get("lastName")?.value,
        email: this.registrationForm.get("email")?.value
      }
    }
    var response = await firstValueFrom(this.authService.register(regRequest));
    this.authService.saveAuthDetails(response);
    await this.router.navigate(["/home"]);
  }

}
