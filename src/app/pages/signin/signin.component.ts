import { Component, inject, AfterViewInit } from '@angular/core';
import { MainComponent } from '../../layouts/main/main.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MainComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent implements AfterViewInit {
  private router = inject(Router);
  private authService = inject(AuthService); // Inject your new service
  private loadingService = inject(LoadingService)

  ngAfterViewInit() {
    // Small timeout ensures the DOM is fully painted
    setTimeout(() => {
      this.initializeGoogleButton();
    }, 100);
  }

  private initializeGoogleButton() {
    const btnElement = document.getElementById('google-btn');
    if (!btnElement) return;

    // @ts-ignore
    google.accounts.id.initialize({
      // Now automatically getting the ID from your environment via the service
      client_id: this.authService.googleClientId,
      callback: this.handleSignIn.bind(this),
      auto_select: false,
    });

    // @ts-ignore
    google.accounts.id.renderButton(btnElement, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: '320',
      logo_alignment: 'left'
    });
  }

  /**
   * handleSignIn
   * Sends the Google credential to Express and waits for the JWT
   */
  async handleSignIn(response: any) {
    try {
      this.loadingService.isLoading.set(true);
      // response.credential is the idToken from Google
      const idToken = response.credential;
      await this.authService.loginWithGoogle(idToken);

      // Only navigate to dashboard if backend call succeeded
      this.router.navigate(['/dashboard']);

    } catch (error) {
      console.error('Login flow failed:', error);
      // Logic for showing a "Login Failed" message could go here
    } finally {
      this.loadingService.isLoading.set(false);
    }
  }
}