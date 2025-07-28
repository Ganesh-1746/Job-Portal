import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('role'); 

    if (token && role === 'ROLE_USER') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

