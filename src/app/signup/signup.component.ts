import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm!: FormGroup;
  isSubmitted: boolean = false;

  user = { username: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.signupForm.valid) {
      const value = this.signupForm.value;

      this.authService.signup(this.user).subscribe(
        (complete: string) => {
          this.router.navigate(['/login']);
        },
        (err: string) => {
          alert(`Unsuccessful registration`);
        }
      );
    }
  }
}
