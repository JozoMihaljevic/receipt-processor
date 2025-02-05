import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card mat-elevation-z4">
        <mat-card-header>
          <mat-card-title>Welcome to Receipt Processor</mat-card-title>
          <mat-card-subtitle>Please sign in to continue</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="button-container">
            <button mat-raised-button color="primary"
                    (click)="signInWithGoogle()"
                    [disabled]="isLoading">
              <mat-icon>google</mat-icon>
              Sign in with Google
            </button>

            <button mat-stroked-button
                    (click)="skipLogin()"
                    [disabled]="isLoading">
              Skip Login (Development Mode)
            </button>
          </div>

          <div *ngIf="isLoading" class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }

    .login-card {
      max-width: 400px;
      width: 90%;
      padding: 24px;
    }

    .button-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }

    mat-card-title {
      margin-bottom: 8px;
    }

    button {
      width: 100%;
    }

    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class LoginComponent {
  isLoading = false;

  constructor(private authService: AuthService) {}

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  skipLogin(): void {
    this.authService.enableDevMode();
  }
}
