import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  collapsed = false;

  @Output() collapseChange = new EventEmitter<boolean>();
  @Output() menuClicked = new EventEmitter<void>(); 

  menuItems = [
    { title: 'Home', url: '/dashboard/home', icon: 'home' },
    { title: 'Jobs', url: '/dashboard/jobs', icon: 'work_history' },
    { title: 'Applied', url: '/dashboard/applied-jobs', icon: 'archive' },
    { title: 'Profile', url: '/dashboard/profile', icon: 'person' }
  ];

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.collapseChange.emit(this.collapsed);
  }

  onMenuClick() {
    this.menuClicked.emit(); 
  }
}
