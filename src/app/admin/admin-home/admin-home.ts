import { Component,HostListener, OnInit, signal } from '@angular/core';
import { Admin } from '../../services/admin';
import { WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {

  totalUsers: WritableSignal<number> = signal(0);
  totalCompanies: WritableSignal<number> = signal(0);
  totalJobs: WritableSignal<number> = signal(0);

  showProfilePanel: boolean = false;

  constructor(private adminService: Admin,private router:Router) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats() {
    this.adminService.getAdminStats().subscribe({
      next: (data) => {
        this.totalUsers.set(data.users);
        this.totalCompanies.set(data.companies);
        this.totalJobs.set(data.jobs);
      },
      error: (err) => {
        console.error('Failed to fetch admin stats:', err);
      }
    });
  }

  toggleProfilePanel(event: MouseEvent) {
    event.stopPropagation();
    this.showProfilePanel = !this.showProfilePanel;
  }

  @HostListener('document:click')
  closeOnOutsideClick() {
    this.showProfilePanel = false;
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
