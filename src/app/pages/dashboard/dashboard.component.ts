import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from '../../layouts/main/main.component';
import { DashboardService } from '../../services/dashboard.service';
import {
  heroUserGroup,
  heroUserMinus,
  heroUserPlus,
  heroUsers,
  heroChartBarSquare,
  heroXMark
} from '@ng-icons/heroicons/outline';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ApiResponse, UserStats } from '../../interface/dashboard';
import { Chart, ChartConfiguration } from 'chart.js';
import { registerables } from 'chart.js';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';

Chart.register(...registerables);

// Constants
const CHART_COLORS = {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Violet
  tertiary: '#ec4899',     // Pink
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  danger: '#ef4444',       // Red
  neutral: '#94a3b8',      // Gray
};

const CHART_CONFIG_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: true,
    duration: 1000,
    easing: 'easeOutQuart' as const,
  },
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MainComponent,
    NgIconComponent,
    LoadingSpinner,
  ],
  providers: [
    provideIcons({
      heroUserGroup,
      heroUserMinus,
      heroUserPlus,
      heroUsers,
      heroChartBarSquare,
      heroXMark
    })
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('roleChart') set roleChart(content: ElementRef) {
    this.initChartIfNeeded(content, 'roleChart');
  }
  @ViewChild('statusChart') set statusChart(content: ElementRef) {
    this.initChartIfNeeded(content, 'statusChart');
  }
  @ViewChild('trendChart') set trendChart(content: ElementRef) {
    this.initChartIfNeeded(content, 'trendChart');
  }
  @ViewChild('countryChart') set countryChart(content: ElementRef) {
    this.initChartIfNeeded(content, 'countryChart');
  }
  @ViewChild('countryChartModal') set countryChartModal(content: ElementRef) {
    this.initChartIfNeeded(content, 'countryChartModal');
  }

  stats: Partial<UserStats> = {};
  isLoading = true;
  isCountryModalOpen = false;

  private chartInstances = new Map<string, Chart>();

  cards = [
    { title: 'Active Users', key: 'activeUsers', icon: 'heroUsers', color: 'green' },
    { title: 'Inactive Users', key: 'inactiveUsers', icon: 'heroUserMinus', color: 'red' },
    { title: 'New Users This Month', key: 'newUsersThisMonth', icon: 'heroUserPlus', color: 'blue' },
    { title: 'Total Users', key: 'totalUsers', icon: 'heroUserGroup', color: 'indigo' },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
  }

  ngOnDestroy() {
    this.destroyAllCharts();
  }

  async loadStats() {
    try {
      const response: ApiResponse<UserStats> = await this.dashboardService.getUserStats();
      if (response?.success && response?.data) {
        this.stats = response.data;
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      this.isLoading = false;
    }
  }

  openCountryModal() {
    this.isCountryModalOpen = true;
  }

  closeCountryModal() {
    this.isCountryModalOpen = false;
    this.destroyChart('countryChartModal');
  }

  // Chart Management
  private initChartIfNeeded(content: ElementRef, chartName: string) {
    if (!content || this.chartInstances.has(chartName)) {
      return;
    }

    switch (chartName) {
      case 'roleChart':
        this.initRoleChart(content);
        break;
      case 'statusChart':
        this.initStatusChart(content);
        break;
      case 'trendChart':
        this.initTrendChart(content);
        break;
      case 'countryChart':
        this.initCountryChart(content);
        break;
      case 'countryChartModal':
        this.initCountryChartModal(content);
        break;
    }
  }

  private destroyChart(chartName: string) {
    const chart = this.chartInstances.get(chartName);
    if (chart) {
      chart.destroy();
      this.chartInstances.delete(chartName);
    }
  }

  private destroyAllCharts() {
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances.clear();
  }

  private storeChart(chartName: string, chart: Chart) {
    this.destroyChart(chartName);
    this.chartInstances.set(chartName, chart);
  }

  // Chart Initialization Methods
  private initRoleChart(canvas: ElementRef) {
    const data = this.stats.usersByRole;
    const chart = new Chart(canvas.nativeElement, this.getDoughnutConfig(
      ['Admin', 'Moderator', 'User'],
      [data?.admin ?? 0, data?.moderator ?? 0, data?.user ?? 0],
      [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary]
    ));
    this.storeChart('roleChart', chart);
  }

  private initStatusChart(canvas: ElementRef) {
    const data = this.stats.usersByStatus;
    const chart = new Chart(canvas.nativeElement, this.getDoughnutConfig(
      ['Active', 'Inactive', 'Suspended', 'Pending'],
      [data?.active ?? 0, data?.inactive ?? 0, data?.suspended ?? 0, data?.pending ?? 0],
      [CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.neutral]
    ));
    this.storeChart('statusChart', chart);
  }

  private initTrendChart(canvas: ElementRef) {
    const trendData = this.stats.registrationTrend || [];
    const labels = trendData.map(d => d.month);
    const counts = trendData.map(d => d.count);

    const chart = new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'New Registrations',
          data: counts,
          borderColor: CHART_COLORS.primary,
          backgroundColor: (context: any) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return 'rgba(99, 102, 241, 0)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: CHART_COLORS.primary,
          borderWidth: 3
        }]
      },
      options: {
        ...CHART_CONFIG_DEFAULTS,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: true, color: 'rgba(0,0,0,0.03)' },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    } as ChartConfiguration<'line'>);
    this.storeChart('trendChart', chart);
  }

  private initCountryChart(canvas: ElementRef) {
    const countryData = this.stats.topCountries || [];
    const chart = new Chart(canvas.nativeElement, this.getBarConfig(
      countryData.map(d => d.country),
      countryData.map(d => d.count),
      25
    ));
    this.storeChart('countryChart', chart);
  }

  private initCountryChartModal(canvas: ElementRef) {
    const countryData = this.stats.topCountries || [];
    const chart = new Chart(canvas.nativeElement, this.getBarConfig(
      countryData.map(d => d.country),
      countryData.map(d => d.count),
      35
    ));
    this.storeChart('countryChartModal', chart);
  }

  // Chart Configuration Factory Methods
  private getDoughnutConfig(
    labels: string[],
    data: number[],
    colors: string[]
  ): ChartConfiguration<'doughnut'> {
    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          hoverOffset: 10,
          borderWidth: 0,
          borderRadius: 0,
          spacing: 1,
        }]
      },
      options: {
        ...CHART_CONFIG_DEFAULTS,
        cutout: '50%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 15, font: { weight: 600 } }
          }
        }
      }
    };
  }

  private getBarConfig(
    labels: string[],
    data: number[],
    barThickness: number
  ): ChartConfiguration<'bar'> {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Users',
          data,
          backgroundColor: CHART_COLORS.primary,
          borderRadius: 8,
          barThickness
        }]
      },
      options: {
        ...CHART_CONFIG_DEFAULTS,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
            border: { display: false }
          },
          y: {
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    };
  }
}
