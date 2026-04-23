import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../layouts/main/main.component';
import { CommonModule } from '@angular/common';
import { User, UsersResponse } from '../../interface/users.interface';
import { DashboardService } from '../../services/dashboard.service';
import { firstValueFrom } from 'rxjs';
import { FilterLayout, FilterField } from '../../interface/filter-interfaces';
import { FilterCard } from '../../components/filter-card/filter-card';
import { TableColumn } from '../../interface/table-interfaces';
import { TableComponent } from '../../layouts/table/table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MainComponent,
    CommonModule,
    FilterCard,
    TableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {

  isLoading = true;
  users: any[] = [];

  userFilterConfig: FilterField[] = [
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'role', label: 'Select Role', type: 'select', options: ['admin', 'user'] }
  ];

  userTableCols: TableColumn[] = [
    { key: 'fullName', label: 'Full Name', type: 'avatar' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'role', label: 'Role', type: 'text' }
  ];

  userFilterLayout: FilterLayout = {
    desktopCols: 4,
    gap: 4
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers(filters: any = {}) {
    this.isLoading = true;
    try {
      const response: UsersResponse = await firstValueFrom(
        this.dashboardService.getUsers()
      );

      if (response?.success && response?.data?.users) {
        let results = response.data.users;

        // --- LOCAL FILTERING ---
        if (filters.firstName) {
          results = results.filter(u =>
            u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
          );
        }

        if (filters.email) {
          results = results.filter(u =>
            u.email.toLowerCase().includes(filters.email.toLowerCase())
          );
        }

        if (filters.role && filters.role !== '') {
          results = results.filter(u => u.role === filters.role);
        }

        this.users = results.map(u => ({
          ...u,
          fullName: `${u.firstName} ${u.lastName}`
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onFilterApplied(data: any) {
    this.loadUsers(data);
  }

  onFilterReset() {
    this.loadUsers();
  }
}