import { Component, ViewChild } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';  // Make sure to use CommonModule instead of BrowserModule
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,  // This should replace BrowserModule
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" *ngIf="isAuthenticated$ | async">
        <button mat-icon-button (click)="toggleSidenav()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>Receipt Processor</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <mat-sidenav-container>
        <mat-sidenav #sidenav mode="over" *ngIf="isAuthenticated$ | async">
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              Dashboard
            </a>
            <a mat-list-item routerLink="/scan">
              <mat-icon matListItemIcon>document_scanner</mat-icon>
              Scan Receipt
            </a>
            <a mat-list-item routerLink="/history">
              <mat-icon matListItemIcon>history</mat-icon>
              History
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content>
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    mat-sidenav-container {
      flex: 1;
    }

    mat-sidenav {
      width: 250px;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .content-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 599px) {
      .content-container {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  @ViewChild(MatSidenav) sidenav?: MatSidenav;
  isAuthenticated$ = this.authService.isAuthenticated();

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}
