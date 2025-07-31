import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/user.module.js';
import { Job } from '../Models/job.model.js';
import { CompanyModule } from '../Models/company.module.js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Admin {

  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
  }

  
  getAllCompanies(): Observable<CompanyModule[]> {
    return this.http.get<CompanyModule[]>(`${this.baseUrl}/allCompanies`);
  }

  registerCompany(company: CompanyModule): Observable<any> {
    return this.http.post(`${this.baseUrl}/company/register`, company);
  }

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/alljobs`);
  }

  addJob(job: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/addjob`, job);
  }

  updateJob(id: number, job: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}/update-job/${id}`, job);
  }

  deleteJob(jobId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-job/${jobId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/allUsers`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-user/${id}`);
  }

  getDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/departments`);
  }

  getJobTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/jobtypes`);
  }
}
