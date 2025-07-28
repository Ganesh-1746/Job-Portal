import { CommonModule } from '@angular/common';
import { Component, OnInit,signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Application } from '../../Models/job-application.model.js';
import { JobApplicationService } from '../../services/job-application.js';


@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications implements OnInit {
  applications: WritableSignal<Application[]> = signal<Application[]>([]);
  selectedId: number | null = null;
  selectedStatus: string = '';
  searchText = '';
  editingApplicationId: number | null = null;

  constructor(private applicationService: JobApplicationService) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications() {
    this.applicationService.getAllApplications().subscribe(data => {
      this.applications.set(data);
    });
  }


  get filteredApplications() {
    const term = this.searchText.toLowerCase();
    return this.applications().filter((app: Application) =>
      app.companyName.toLowerCase().includes(term) ||
      app.jobTitle.toLowerCase().includes(term)
    );
  }
  
  
  filteredApplication() {
    if (!this.searchText) {
      return this.applications;
    }
  
    const term = this.searchText.toLowerCase();
    return this.applications().filter((app: Application) =>
      app.companyName.toLowerCase().includes(term) ||
      app.jobTitle.toLowerCase().includes(term)
    );
  }

  startEditing(appId: number, currentStatus: string) {
    this.editingApplicationId = appId;
    this.selectedStatus = currentStatus;
  }
  
  cancelEditing() {
    this.editingApplicationId = null;
    this.selectedStatus = '';
  }

  saveStatus(appId: number, status: string) {
    this.applicationService.updateApplicationStatus(appId, status).subscribe(() => {
      const updatedApps = this.applications().map(app => {
        if (app.applicationId === appId) {
          return { ...app, status };
        }
        return app;
      });
      this.applications.set(updatedApps);
      this.editingApplicationId = null;
      this.selectedStatus = '';
      alert('Status updated successfully!');
    });
  }  
}

