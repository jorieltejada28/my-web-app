import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../layouts/main/main.component';
import { CommonModule } from '@angular/common';
import { User, UsersResponse } from '../../interface/users';
import { DashboardService } from '../../services/dashboard.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [MainComponent, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {

  isLoading = true;
  users: User[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const response: UsersResponse = await firstValueFrom(this.dashboardService.getUsers());
      if (response?.success && response?.data) {
        this.users = response.data;
      }

      console.log('Fetching Users: ', response);
    } catch (error) {
      console.log('Error fetching users:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
