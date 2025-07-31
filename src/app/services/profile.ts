import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/user.module';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Profile {
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/view-details`);
  }

  updateUser(mobileNo: string, location: string, resume: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('mobileNo', mobileNo);
    formData.append('location', location);
    if (resume) {
      formData.append('resume', resume);
    }

    return this.http.put(`${this.baseUrl}/update`, formData);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword
    });
  }
}
