import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  imports: [ReactiveFormsModule, RouterModule],
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  fromGroup!: FormGroup;
  isSubmitted: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.fromGroup = new FormGroup({
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
    if (this.fromGroup.valid) {
      const user = this.fromGroup.value;

      this.authService.signup(user).subscribe(
        (response) => {
          alert('User registered successfully');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error(error);
          alert('Registration failed');
        }
      );
    }
  }
}
