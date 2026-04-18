import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapGithub, bootstrapLinkedin, bootstrapTwitter, bootstrapGlobe } from '@ng-icons/bootstrap-icons';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  // 3. Use NgIconComponent here
  imports: [CommonModule, NgIconComponent],
  // 4. Provide the icons so the compiler can find them
  providers: [
    provideIcons({
      bootstrapGithub,
      bootstrapLinkedin,
      bootstrapTwitter,
      bootstrapGlobe,
    }),
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private authService = inject(AuthService);

  brandInfo = {
    name: environment.Title,
    version: environment.version,
    description: 'Building the future of the web with precision and passion.',
  };

  // 5. Update socialLinks to use the string names registered in provideIcons
  socialLinks = [
    { name: 'Github', icon: 'bootstrapGithub', url: '#' },
    { name: 'LinkedIn', icon: 'bootstrapLinkedin', url: '#' },
    { name: 'Twitter', icon: 'bootstrapTwitter', url: '#' },
    { name: 'Website', icon: 'bootstrapGlobe', url: '#' },
  ];

  footerLinks = [
    { label: 'Status', path: '#' },
    { label: 'Sitemap', path: '#' },
    { label: 'Cookies', path: '#' }
  ];

  sendSupportRequest(email: string, desc: string) {
    console.log('Support Request:', { email, desc });
    alert('Request sent!');
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}