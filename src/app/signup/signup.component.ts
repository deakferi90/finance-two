import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitted = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.signupForm.valid) {
      console.log('Form Data:', this.signupForm.value);

      this.authService.signup(this.signupForm.value).subscribe(
        (response: any) => {
          this.toastr.success('You successfully signed up!');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Signup error:', error);
          this.toastr.error(
            `Unsuccessful registration: ${
              error.error?.message || 'Unknown error'
            }`
          );
        }
      );
    }
  }
}
