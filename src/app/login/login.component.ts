import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../interfaces/template-interfaces';
import { SimpleUserDetails } from '../interfaces/user-interfaces';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '@angular/compiler';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCard, MatCardHeader, MatCardContent, MatLabel, MatInput, MatButton],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private router: Router,
              private authService: AuthService, private location: Location) {
    
    this.loginForm = this.formBuilder.group({ username: "", password: "" });
  };

  ngOnInit(): void {
    
  }

  async onSubmit() {
    
    var credentials: LoginRequest = {
      username: this.loginForm.get("username")?.value,
      password: this.loginForm.get("password")?.value
    }
    try {
      //this.authService.attemptLogin(credentials).subscribe(vals => h  = vals.headers.get("authorization"));
      let response = await firstValueFrom(this.authService.attemptLogin(credentials));
      var userDetails: SimpleUserDetails = response.body;
      var authHeader = response.headers.get("authorization");

      localStorage.setItem("authToken", "Bearer " + authHeader);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      var url = localStorage.getItem("redirectUrl");
      if (url !== null) {
        localStorage.removeItem("redirectUrl");
        this.router.navigateByUrl(url);
      } else {
        this.location.back();
      }
    } catch (e) {
      
      this.errorMessage = "Invalid Credentials!";
      this.loginForm.setValue({ username: "", password: "" });
    }
  }

}
