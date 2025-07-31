import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { UserDetails } from '../Models/user-details';
import { JwtPayload } from '../Models/jwt-payload';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}`;
  private refreshEndpoint = '/api/refresh';

  constructor(private http: HttpClient,private router: Router) {}

  login(email: string, password: string, isAdmin: boolean): Observable<any> {
    const endpoint = isAdmin ? '/api/admin/login' : '/api/user/login';
    return this.http.post(`${this.baseUrl}${endpoint}`, { email, password }).pipe(
      tap((res: any) => {
        this.storeTokens(res.token, res.refreshToken, res.role);
      })
    );
  }

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/user/register`, formData);
  }

  getTotalJobs(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/user/count`);
  }

  getAppliedJobsCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/user/apply-count?userId=${userId}`);
  }

  getUserDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.baseUrl}/user/view-details`);
  }

  storeTokens(token: string, refreshToken: string, role?: string) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    if (role) localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getAccessToken(): string | null {
    return this.getToken();
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwt_decode<JwtPayload>(token);
      } catch (error) {
        console.error('Invalid JWT Token:', error);
        return null;
      }
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.baseUrl}/refresh`, { refreshToken });
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    return this.http.post(`${this.baseUrl}${this.refreshEndpoint}`, {
      refreshToken: refreshToken
    }).pipe(
      tap((res: any) => {
        if (res.token) {
          this.setAccessToken(res.token);
          if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken); 
          }
        }
      })
    );
  }
}
