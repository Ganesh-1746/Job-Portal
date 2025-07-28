import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../services/profile';
import { User } from '../../Models/user.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class profile implements OnInit {
  userSignal = signal<User>({
    id: 0,
    name: '',
    email: '',
    mobileNo: '',
    location: '',
    role: '',
    resumeurl: ''
  });

  editMode = false;
  showPasswordChange = false;
  selectedFile: File | null = null;

  oldPassword = '';
  newPassword = '';
  newConfirmPassword = '';

  constructor(private profileService: Profile) {}

  ngOnInit(): void {
    this.profileService.getUserDetails().subscribe({
      next: (data: User) => this.userSignal.set(data),
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  enableEdit() {
    this.editMode = true;
  }

  onBack() {
    this.editMode = false;
    this.showPasswordChange = false;
    this.selectedFile = null;
    this.ngOnInit();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    }
  }

  updateProfile() {
    const user = this.userSignal();
    this.profileService.updateUser(user.mobileNo, user.location, this.selectedFile).subscribe({
      next: () => {
        alert('Profile updated successfully');
        this.editMode = false;
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error updating profile', err);
        alert('Update failed');
      }
    });
  }

  viewResume() {
    const resumeurl = this.userSignal().resumeurl;
    if (resumeurl) {
      window.open(resumeurl, '_blank');
    } else {
      alert('No resume found!');
    }
  }

  toggleChangePassword() {
    this.showPasswordChange = !this.showPasswordChange;
    this.editMode = false;
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.newConfirmPassword) {
      alert("All fields are required");
      return;
    }
    if (this.newPassword !== this.newConfirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    this.profileService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        alert("Password changed successfully!");
        this.oldPassword = this.newPassword = this.newConfirmPassword = '';
        this.showPasswordChange = false;
      },
      error: (err) => {
        console.error('Password change error', err);
        alert('Password change failed: ' + (err.error.message || ''));
      }
    });
  }
}
