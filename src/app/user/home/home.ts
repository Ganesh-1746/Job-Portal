import { CommonModule } from '@angular/common';
import { Component, HostListener, signal, OnInit,WritableSignal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDetails } from '../../Models/user-details';
import { User } from '../../Models/user.module.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  userInfo = signal<UserDetails | null>(null);
  jobsLength: WritableSignal<number> = signal(0);
  appliedJobsLength: WritableSignal<number> = signal(0);

  showProfilePanel: boolean = false;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.initialLoad();
  }

  initialLoad(): void{
    this.authService.getUserDetails().subscribe({
      next: (user: UserDetails) => {
        this.userInfo.set({
          id: user.id,
          name: user.name,
          email: user.email,
          location: user.location,
          mobileNo: user.mobileNo,
          role: user.role,
          resumeurl: user.resumeurl
        })
      this.authService.getTotalJobs().subscribe({
        next: (count) => this.jobsLength.set(count),
        error: (err) => console.error('Failed to fetch jobs count', err)
      });

      this.authService.getAppliedJobsCount(user.id).subscribe({
        next: (count) => this.appliedJobsLength.set(count),
        error: (err) => console.error('Failed to fetch applied jobs count', err)
      });
    },
      error: (err) => {
        console.error('Failed to load user details:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

  toggleProfilePanel(event: MouseEvent) {
    event.stopPropagation();
    this.showProfilePanel = !this.showProfilePanel;
  }

  @HostListener('document:click')
  closeOnOutsideClick() {
    this.showProfilePanel = false;
  }

}
