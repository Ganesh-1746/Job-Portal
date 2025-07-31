import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Job } from '../../Models/job.model';
import { Admin } from '../../services/admin.js';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-jobs.html',
  styleUrl: './admin-jobs.css'
})
export class AdminJobs implements OnInit, AfterViewInit {
  filteredJobs: WritableSignal<Job[]> = signal<Job[]>([]);
  private _selectedTab: 'view' | 'add' | 'edit' = 'view';
  searchText ='';

  get selectedTab() {
    return this._selectedTab;
  }

  set selectedTab(value: 'view' | 'add' | 'edit') {
    if (this._selectedTab !== value) {
      this._selectedTab = value;
      if (value === 'view') {
        this.fetchJobs();
      }
    }
  }

  goToTab(tab: 'view' | 'add' | 'edit') {
    if (tab === 'view') {
      this.fetchJobs();
      this.jobForm.reset();
      this.selectedJobIndex = null;
    }
  
    this.selectedTab = tab;
  }
  

  selectedJobIndex: number | null = null;
  jobForm: FormGroup;
  jobs: WritableSignal<Job[]> = signal<Job[]>([]);
  companies: any[] = [];
  departments: string[] = [];
  jobTypes: string[] = [];

  private fb = inject(FormBuilder);
  private adminService = inject(Admin);

  constructor() {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      jobDescription: ['', Validators.required],
      experienceRequired: ['', Validators.required],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      department: ['', Validators.required],
      postedDate: ['', Validators.required],
      companyId: ['', Validators.required],
      expectedSalary: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchCompanies();
    this.fetchDepartments();
    this.fetchJobTypes();
  }

  ngAfterViewInit() {
    this.goToTab('view');
  }

  fetchJobs() {
    this.adminService.getAllJobs().subscribe((data: any) => {
      const enrichedJobs = data.map((job: any) => ({
        ...job,
        companyName: this.getCompanyNameById(job.companyId)
      }));
      this.jobs.set(enrichedJobs);
      this.filteredJobs.set(enrichedJobs);
    });
  }
  

  fetchCompanies() {
    this.adminService.getAllCompanies().subscribe({
      next: (data) => this.companies = data,
      error: (err) => console.error('Error fetching companies:', err)
    });
  }

  fetchDepartments() {
    this.adminService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Error fetching departments:', err)
    });
  }

  fetchJobTypes() {
    this.adminService.getJobTypes().subscribe({
      next: (data) => this.jobTypes = data,
      error: (err) => console.error('Error fetching job types:', err)
    });
  }

  submitJob() {
    if (this.jobForm.invalid) return;

    const formValue = this.jobForm.value;
    const payload = {
      title: formValue.jobTitle,
      description: formValue.jobDescription,
      experience: formValue.experienceRequired,
      location: formValue.location,
      jobType: formValue.jobType,
      department: formValue.department,
      salary: formValue.expectedSalary,
      postedDate: formValue.postedDate,
      companyId: +formValue.companyId
    };

    if (this.selectedTab === 'edit' && this.selectedJobIndex !== null) {
      const jobId = this.jobs().at(this.selectedJobIndex)?.id;
      this.adminService.updateJob(jobId!, payload).subscribe({
        next: (res) => {
          alert('Job updated successfully!');
          this.fetchJobs();
          this.selectedTab = 'view';
          this.jobForm.reset();
          this.selectedJobIndex = null;
        },
        error: (err) => console.error('Update job failed', err)
      });
    } else {
      this.adminService.addJob(payload).subscribe({
        next: (newJob) => {
          alert('Job added successfully!');
          this.jobs.set([...this.jobs(), newJob]);
          this.selectedTab = 'view';
          this.jobForm.reset();
        },
        error: (err) => console.error('Add job failed', err)
      });
    }
  }

  editJob(index: number) {
    this.selectedTab = 'edit';
    this.selectedJobIndex = index;
    const job = this.jobs().at(index);

    if (!job) return;

    if (this.companies.length === 0) {
      this.fetchCompanies();
      setTimeout(() => this.patchJobForm(job), 300);
    } else {
      this.patchJobForm(job);
    }
  }

  patchJobForm(job: any) {
    let companyId: number | null = null;

    if (typeof job.company === 'object' && job.company?.id) {
      companyId = job.company.id;
    } else if (typeof job.company === 'string') {
      const matchedCompany = this.companies.find(
        (c) => c.name.toLowerCase() === job.company.toLowerCase()
      );
      if (matchedCompany) {
        companyId = matchedCompany.id;
      } else {
        console.warn("No matching company found for name:", job.company);
      }
    }

    this.jobForm.patchValue({
      jobTitle: job.title,
      jobDescription: job.description,
      experienceRequired: job.experience,
      location: job.location,
      jobType: job.jobType,
      department: job.department,
      postedDate: job.postedDate,
      companyId: companyId?.toString() ?? '',
      expectedSalary: job.salary
    });
  }

  get jobList(): Job[] {
    return this.filteredJobs();
  }

  onSearch() {
    const text = this.searchText.trim().toLowerCase();
    if (!text) {
      this.filteredJobs.set(this.jobs());
      return;
    }
  
    const filtered = this.jobs().filter(job =>
      job.title.toLowerCase().includes(text) ||
      job.companyName.toLowerCase().includes(text) ||
      job.location.toLowerCase().includes(text) ||
      job.department.toLowerCase().includes(text) ||
      job.jobType.toLowerCase().includes(text)
    );
  
    this.filteredJobs.set(filtered);
  }
  
  

  getCompanyNameById(id: number): string {
    const company = this.companies.find(c => c.id === id);
    return company ? company.name : 'Unknown';
  }

  deleteJob(index: number) {
    const jobId = this.jobs().at(index)?.id;
    if (confirm('Are you sure you want to delete this job?')) {
      this.adminService.deleteJob(jobId!).subscribe({
        next: () => {
          const newJobs = this.jobs().filter((_, i) => i !== index);
          this.jobs.set(newJobs);
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}
