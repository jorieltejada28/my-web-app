import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  name = environment.Title;

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Projects', path: '/projects' },
    { label: 'Pricing', path: '/pricing' }
  ];
}
