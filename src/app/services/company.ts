import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyModule } from '../Models/company.module.js';

@Injectable({
  providedIn: 'root'
})
export class Company {
  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<CompanyModule[]> {
    return this.http.get<CompanyModule[]>(`${this.baseUrl}/allCompanies`);
  }
  
  registerCompany(company: any): Observable<any> {
    return this.http.post<CompanyModule>(`${this.baseUrl}/company/register`, company);
  }
}
