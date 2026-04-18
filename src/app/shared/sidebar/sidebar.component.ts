import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChartBarSquare,
  heroEnvelope,
  heroUsers,
  heroCube,
  heroArrowRightOnRectangle,
  heroUserCircle,
  heroShieldCheck,
  heroCog6Tooth,
  heroChevronDown,
} from '@ng-icons/heroicons/outline';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      heroChartBarSquare,
      heroEnvelope,
      heroUsers,
      heroCube,
      heroArrowRightOnRectangle,
      heroUserCircle,
      heroShieldCheck,
      heroCog6Tooth,
      heroChevronDown,
    }),
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSettingsOpen = false;
  name = 'myApp';

  private authService = inject(AuthService);
  public loadingService = inject(LoadingService);

  menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: 'heroChartBarSquare' },
    { title: 'Users', path: '/users', icon: 'heroUsers' },
    { title: 'Inbox', path: '/inbox', icon: 'heroEnvelope', badge: 3 },
    { title: 'Products', path: '/products', icon: 'heroCube' },
  ];

  settingsItems = [
    { label: 'Profile Settings', path: '/settings/profile', icon: 'heroUserCircle' },
    { label: 'Account Security', path: '/settings/security', icon: 'heroShieldCheck' },
  ];

  logoutItem = { label: 'Logout', icon: 'heroArrowRightOnRectangle' };

  constructor(private router: Router) { }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  get currentUser() {
    return this.authService.user;
  }

  get avatarUrl(): string {
    const user = this.currentUser;
    if (user?.picture) {
      return user.picture;
    }
    const displayName = user?.name || user?.given_name || 'User';

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`;
  }

  logout() {
    localStorage.removeItem('jwtToken');

    requestAnimationFrame(() => {
      this.loadingService.isLoading.set(true);

      requestAnimationFrame(() => {
        this.router.navigate(['/signin']);
      });
    });
  }
}
