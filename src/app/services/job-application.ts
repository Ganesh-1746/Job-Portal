import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../Models/job-application.model';


@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private baseUrl = 'http://localhost:8080/admin'; 

  constructor(private http: HttpClient) {}

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/all-Applications`);
  }

  updateApplicationStatus(id: number, newStatus: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/Application/${id}`, { status: newStatus });
  }
}


