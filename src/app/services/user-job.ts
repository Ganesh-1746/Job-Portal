import { Injectable,signal } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../Models/job.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserJob {
  private baseUrl = `${environment.apiUrl}`; 

  constructor(private http: HttpClient) {}

  private selectedJob = signal<Job | null>(null);

  getSelectedJob() {
    return this.selectedJob.asReadonly();
  }

  setSelectedJob(job: Job | null) {
    this.selectedJob.set(job);
  }

  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/all-jobs`);
  }
  
  getAppliedJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/applied-jobs`);
  }
  
  getJobById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/jobs/${id}`);
  }
  
  searchJobs(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/jobs-search?keyword=${keyword}`);
  }
  
  applyToJob(jobId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/apply/${jobId}`, {});
  }
  
}