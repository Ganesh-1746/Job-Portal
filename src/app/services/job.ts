import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Job {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alljobs`);
  }
  
  addJob(job: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addjob`, job);
  }

  updateJob(id: number, job: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-job/${id}`, job);
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-job/${id}`);
  }
}
