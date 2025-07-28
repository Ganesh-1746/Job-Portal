import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '../../Models/jwt-payload';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginMode: 'user' | 'admin' = 'user';
  loginLabel = 'Enter User Credentials';
  usernamePlaceholder = 'Username';
  passwordPlaceholder = 'Password';
  RegisterMessage = "Don't have an account? ";
  isAdminLogin = false;
  isRegisterForm = signal<boolean>(false);
  registerForm: FormGroup;
  resumeFile: File | null = null;

  username = '';
  password = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      location: ['', Validators.required],
      password: ['', Validators.required],
      resume: [null, Validators.required]
    });
  }
  
  switchMode(mode: 'user' | 'admin') {
    this.loginMode = mode;
    if (mode === 'admin') {
      this.loginLabel = 'Enter Admin Credentials';
      this.usernamePlaceholder = 'Admin Username';
      this.passwordPlaceholder = 'Admin Password';
      this.isAdminLogin = true;
    } else {
      this.loginLabel = 'Enter User Credentials';
      this.usernamePlaceholder = 'Username';
      this.passwordPlaceholder = 'Password';
      this.isAdminLogin=false;
    }
  }

  switchLoginMode() {
    this.isAdminLogin = !this.isAdminLogin;
  }

  switchForm() {
    if(this.isRegisterForm()){
      this.isRegisterForm.set(false);
    } else{
      this.isRegisterForm.set(true);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type.includes('wordprocessingml.document'))) {
      this.resumeFile = file;
      this.registerForm.patchValue({ resume: file });
    } else {
      alert('Only PDF and DOC/DOCX files are allowed.');
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.entries(this.registerForm.value).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      if (this.resumeFile) {
        formData.append('resume', this.resumeFile);
      }
  
      this.authService.registerUser(formData).subscribe({
        next: (res) => {
          alert('Registration successful. You can now log in.');
          this.switchForm();
        },
        error: (err) => {
          console.error('Registration failed:', err);
          alert('Registration failed.');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onLogin() {
    if (!this.username || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    this.authService.login(this.username, this.password, this.isAdminLogin).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.authService.saveRefreshToken(res.refreshToken);

        const decoded: JwtPayload = jwtDecode(res.token);

        localStorage.setItem('role', decoded.role);

        if (decoded.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-dashboard/admin-home']);
        } else if (decoded.role === 'ROLE_USER') {
          this.router.navigate(['/dashboard/home']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid credentials');
      }
    });
  }
}
  
