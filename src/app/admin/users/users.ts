import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../../services/admin';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../Models/user.module.js';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  users: any[] = [];

  constructor(private adminService: Admin, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges(); // ⬅️ force view update
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
      }
    });
  }
  
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          alert('User deleted successfully!');
        },
        error: (err) => {
          console.error('Failed to delete user:', err);
          alert('Failed to delete user');
        }
      });
    }
  }
}
