import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, FormsModule],
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
          alert(`User registered successfully ${complete}`);
          this.router.navigate(['/login']);
        },
        (err: string) => {
          alert(`Unsuccessful registration`);
        }
      );
    }
  }
}
