import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { AppliedJob } from '../../services/applied-jobs.js'; // service
import { Applied_Jobs } from '../../Models/applied-jobs.model'; // model

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applied-jobs.html',
  styleUrl: './applied-jobs.css',
})

export class AppliedJobs implements OnInit {
  appliedJobs = signal<Applied_Jobs[]>([]);
  selectedJob = signal<Applied_Jobs | null>(null);

  constructor(private jobService: AppliedJob) {}

  ngOnInit(): void {
    this.jobService.getAppliedJobs().subscribe({
      next: (data) => this.appliedJobs.set(data),
      error: (err) => console.error('Failed to fetch applied jobs', err)
    });
  }

  viewStatus(job: Applied_Jobs) {
    this.selectedJob.set(job);
  }

  goBack() {
    this.selectedJob.set(null);
  }
}
