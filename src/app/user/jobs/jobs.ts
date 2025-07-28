import { CommonModule } from '@angular/common';
import { Component, OnInit, signal ,Input, Output, EventEmitter} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserJob } from '../../services/user-job';
import { Job } from '../../Models/job.model';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class Jobs implements OnInit {
  searchText = '';
  searchTerm = '';
  @Input() job: any;
  @Output() viewDetails = new EventEmitter<any>();

  jobs = signal<Job[]>([]);
  filteredJobs = signal<Job[]>([]);
  selectedJob = signal<Job | null>(null);
  appliedJobIds = signal<number[]>([]);
  searchResults = signal<Job[]>([]);

  constructor(private jobService: UserJob) {}

  ngOnInit(): void {
    this.loadAllJobs();
    this.fetchAppliedJobs();
  }

  loadAllJobs() {
    this.jobService.getAllJobs().subscribe({
      next: (data: Job[]) => {
        this.jobs.set(data);
        this.filteredJobs.set(data); 
      },
      error: (err) => console.error('Error loading jobs', err),
    });
  }

  onViewDetails() {
    this.viewDetails.emit(this.job);
  }

  fetchAppliedJobs() {
    this.jobService.getAppliedJobs().subscribe({
      next: (data: Job[]) => {
        const ids = data.map((job) => job.id);
        this.appliedJobIds.set(ids);
      },
      error: (err) => console.error('Error fetching applied jobs:', err),
    });
  }

  filterJobs() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredJobs.set(this.jobs());
      return;
    }
  
    const filtered = this.jobs().filter((job: Job) => {
      const title = job.title?.toLowerCase() || '';
      const companyName = job.companyName?.toLowerCase() || '';
      const location = job.location?.toLowerCase() || '';
      const jobType = job.jobType?.toLowerCase() || '';
      const department = job.department?.toLowerCase() || '';
  
      return (
        title.includes(term) ||
        companyName.includes(term) ||
        location.includes(term) ||
        jobType.includes(term) ||
        department.includes(term)
      );
    });
  
    this.filteredJobs.set(filtered);
  }
  
  viewJobDetails(job: Job) {
    this.selectedJob.set(job);
  }

  goBackToList() {
    this.selectedJob.set(null);
  }

  isAlreadyApplied(jobId: number): boolean {
    return this.appliedJobIds().includes(jobId);
  }

  applyToJob(job: Job) {
    this.jobService.applyToJob(job.id).subscribe({
      next: () => {
        alert('✅ Application submitted successfully!');
        this.appliedJobIds.update((ids) => [...ids, job.id]);
      },
      error: (err) => {
        console.error('❌ Error applying for job:', err);
        if (err.status === 409) {
          alert('⚠️ You have already applied for this job.');
        } else {
          alert('❌ Failed to apply for the job. Try again later.');
        }
      },
    });
  }
}
