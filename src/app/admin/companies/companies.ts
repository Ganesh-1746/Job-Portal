import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Company } from '../../services/company';
import { CompanyModule } from '../../Models/company.module.js';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Companies implements OnInit {
  selectedTab: 'list' | 'register' = 'list';

  companies: CompanyModule[] = [];

  companyForm: FormGroup;

  constructor(
    private companyService: Company,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.companyForm = this.fb.group({
      name: [''],
      description: [''],
      jobs: [''] 
    });
  }

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      }
    });
  }

  switchTab(tab: 'list' | 'register') {
    this.selectedTab = tab;
    if (tab === 'list') {
      this.fetchCompanies();
    }
  }

  onSubmit(): void {
    const formValue = this.companyForm.value;
    const company = {
      name: formValue.name,
      description: formValue.description,
      jobs: formValue.jobs.split(',').map((job: string) => job.trim())
    };

    this.companyService.registerCompany(company).subscribe({
      next: () => {
        alert('Company registered successfully!');
        this.companyForm.reset();
        this.switchTab('list');
      },
      error: (err) => {
        console.error('Registration error', err);
        alert('Failed to register company. Unauthorized or invalid input.');
      }
    });
  }
}
