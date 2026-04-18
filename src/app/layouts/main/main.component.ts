import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [NavbarComponent, FooterComponent, SidebarComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  private readonly authRoutes = ['/signin'];

  showSidebar = false;
  showNavbar = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  ngOnInit() {
    this.updateLayout();

    // Listen for route changes and update layout accordingly
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateLayout();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLayout() {
    const loggedIn = this.isLoggedIn;
    const isAuthPage = this.isAuthPage();
    this.showSidebar = loggedIn && !isAuthPage;
    this.showNavbar = !loggedIn || isAuthPage;
  }

  private isAuthPage(): boolean {
    return this.authRoutes.some(route => this.router.url.includes(route));
  }
}
