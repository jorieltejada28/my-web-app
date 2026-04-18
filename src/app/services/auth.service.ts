import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  /**
   * Getter to expose the Google Client ID from the environment
   */
  public get googleClientId(): string {
    return environment.googleClientId;
  }

  get user() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  public async loginWithGoogle(idToken: string): Promise<any> {
    const url = `${this.apiUrl}/google`;

    const response = await firstValueFrom(
      this.http.post<any>(url, { idToken })
    );

    if (response && response.token) {
      localStorage.setItem('jwtToken', response.token);
    }

    return response;
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('jwtToken');
    return !!token;
  }
}
