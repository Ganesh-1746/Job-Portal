import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
  collapsed = false;
  sidebarVisible = false;

  @Output() collapseChange = new EventEmitter<boolean>();
  @Output() menuClicked = new EventEmitter<void>();

  adminMenuItems = [
    { title: 'Home', url: '/admin-dashboard/admin-home', icon: 'home' },
    { title: 'Companies', url: '/admin-dashboard/companies', icon: 'business' },
    { title: 'Users', url: '/admin-dashboard/users', icon: 'people' },
    { title: 'Jobs', url: '/admin-dashboard/jobs', icon: 'work' },
    { title: 'Applications', url: '/admin-dashboard/applications', icon: 'assignment' }
  ];

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.collapseChange.emit(this.collapsed);
  }

  onNavItemClick() {
    this.hideSidebarOnMobile();
  }  

  toggleMobileSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  hideSidebarOnMobile() {
      this.menuClicked.emit();
  }

  screenIsWide(): boolean {
    return window.innerWidth >= 768;
  }

  @HostListener('window:resize', [])
  onResize() {
    if (this.screenIsWide()) {
      this.sidebarVisible = false;
    }
  }
}