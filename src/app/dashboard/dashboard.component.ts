import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MockService } from '../services/mock.service';
import { Receipt } from '../models/receipt.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>

      <div class="quick-actions">
        <mat-card class="action-card" routerLink="/scan">
          <mat-card-content>
            <mat-icon>document_scanner</mat-icon>
            <h2>Scan Receipt</h2>
            <p>Upload and process a new receipt</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card" routerLink="/history">
          <mat-card-content>
            <mat-icon>history</mat-icon>
            <h2>View History</h2>
            <p>See all your processed receipts</p>
          </mat-card-content>
        </mat-card>
      </div>

      <h2>Recent Receipts</h2>
      <div class="recent-receipts">
        <mat-card *ngFor="let receipt of recentReceipts" class="receipt-card">
          <mat-card-header>
            <mat-card-title>{{ receipt.storeName }}</mat-card-title>
            <mat-card-subtitle>{{ receipt.date }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="total">Total: {{ receipt.totalSum }}€</p>
            <p>{{ receipt.items.length }} items</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin: 24px 0;
    }

    .action-card {
      cursor: pointer;
      transition: transform 0.2s;
    }

    .action-card:hover {
      transform: translateY(-4px);
    }

    .action-card mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px;
    }

    .action-card mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .recent-receipts {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 16px;
    }

    .receipt-card {
      margin-bottom: 16px;
    }

    .total {
      font-weight: bold;
      margin-top: 8px;
    }

    @media (max-width: 599px) {
      .dashboard-container {
        padding: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  recentReceipts: Receipt[] = [];

  constructor(private mockService: MockService) {}

  ngOnInit() {
    this.mockService.getMockReceipts().subscribe(
      receipts => this.recentReceipts = receipts
    );
  }
}
