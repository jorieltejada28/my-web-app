import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UsersResponse } from '../interface/users';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private liveApiUrl: string = `${environment.liveApiUrl}/users`;

  constructor(private http: HttpClient) { }

  async getUserStats(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.liveApiUrl}/stats`));
  }

  getUsers() {
    return this.http.get<UsersResponse>(`${this.liveApiUrl}`);
  }
}
