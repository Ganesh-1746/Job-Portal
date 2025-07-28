import { CommonModule } from '@angular/common';
import { Component ,HostListener} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from "../user/sidebar/sidebar";

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,Sidebar],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard {
  selectedView: string = 'user-details';
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  isMobile = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; 
    if (!this.isMobile) {
      this.isMobileSidebarOpen = false; 
    }
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = true;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  onSidebarCollapseChange(value: any) {
    if (typeof value === 'boolean') {
      this.isSidebarCollapsed = value;
    }
  }  
}
