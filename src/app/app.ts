import { 
  Component, 
  inject, 
  signal 
} from '@angular/core';
import { 
  RouterOutlet, 
  Router, 
  NavigationStart, 
  NavigationEnd, 
  NavigationCancel, 
  NavigationError 
} from '@angular/router';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  private router = inject(Router);
  public loadingService = inject(LoadingService);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.isLoading.set(true);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.isLoading.set(false);
      }
    });
  }
}