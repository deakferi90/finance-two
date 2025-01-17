import { Component } from '@angular/core';
import { inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  errorMessage: string = '';
  email: string = '';
  password: string = '';

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.isLoggedIn = true;
    this.errorMessage = '';
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        () => {
          // this.router.navigate(['/overview']);
        },
        (error) => {
          this.errorMessage = 'Invalid email or password. Please try again.';
          this.isLoggedIn = false;
        }
      );
    }
  }
}
