import { HttpInterceptorFn, HttpClient, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse } from '../Models/login-response.model';
import { AuthService } from '../services/auth.service'; 
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const http = inject(HttpClient);

  const token = localStorage.getItem('jwtToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const isAuthError = err.status === 401;
      const isNotLoginOrRefresh =
        !req.url.endsWith('/login') && !req.url.endsWith('/refresh-token');

      if (isAuthError && isNotLoginOrRefresh && refreshToken) {
        return http
          .post<LoginResponse>(`${environment.apiUrl}/api/refresh-token`, {
            refreshToken
          })
          .pipe(
            switchMap((res) => {
              if (res.accessToken) {
                localStorage.setItem('jwtToken', res.accessToken);
              }
              if (res.refreshToken) {
                localStorage.setItem('refreshToken', res.refreshToken);
              }

              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.accessToken}`
                }
              });

              return next(newReq);
            }),
            catchError((refreshErr) => {
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshErr);
            })
          );
      } else if (isAuthError) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
