import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppliedJob {
  constructor(private http: HttpClient) {}

  getAppliedJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/user/applied-jobs`);
  }
}
