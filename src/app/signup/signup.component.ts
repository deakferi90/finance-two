import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    // Call the signup method in AuthService to send data to the backend
    this.authService.signup(user).subscribe(
      (response) => {
        alert('User registered successfully');
        this.router.navigate(['/login']); // Redirect to login page
      },
      (error) => {
        console.error(error);
        alert('Registration failed');
      }
    );
  }
}
