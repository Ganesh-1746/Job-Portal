import { Component,HostListener } from '@angular/core';
import { AdminSidebar } from "../admin/admin-sidebar/admin-sidebar";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  isSidebarCollapsed = false;
  showMobileSidebar = false;
  isDesktop = window.innerWidth >= 768;
  sidebarVisible = true; 


  hideSidebarOnMobile() {
      this.sidebarVisible = !this.sidebarVisible;
  }

  toggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  onSidebarCollapseChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = event.target.innerWidth >= 768;
    if (this.isDesktop) {
      this.showMobileSidebar = false; 
  }
}
}