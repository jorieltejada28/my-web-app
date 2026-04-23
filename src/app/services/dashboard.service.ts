import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { UsersResponse } from '../interface/users.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private liveApiUrl: string = `${environment.liveApiUrl}/users`;

  constructor(private http: HttpClient) { }

  async getUserStats(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.liveApiUrl}/stats`));
  }

  getUsers(filters?: any): Observable<UsersResponse> {
    let params = new HttpParams();

    // 2. Safely check for filters
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.append(key, filters[key]);
        }
      });
    }

    // 3. IMPORTANT: You MUST pass the params object here for the API to see them
    return this.http.get<UsersResponse>(this.liveApiUrl, { params });
  }
}
