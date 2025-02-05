import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MockService } from '../services/mock.service';
import { Receipt } from '../models/receipt.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="history-container">
      <h1>Receipt History</h1>

      <div class="receipts-grid">
        <mat-card *ngFor="let receipt of receipts" class="receipt-card">
          <mat-card-header>
            <mat-card-title>{{ receipt.storeName }}</mat-card-title>
            <mat-card-subtitle>{{ receipt.date }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="receipt-summary">
              <p class="total">Total: {{ receipt.totalSum }}€</p>
              <p>Items: {{ receipt.items.length }}</p>
            </div>

            <div class="items-list">
              <div *ngFor="let item of receipt.items" class="item">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-details">
                  <span *ngIf="item.quantity">{{ item.quantity }} ·</span>
                  <span>{{ item.price }}€</span>
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 24px;
    }

    .receipts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .receipt-card {
      height: 100%;
    }

    .receipt-summary {
      margin: 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    .total {
      font-size: 1.2em;
      font-weight: 500;
      color: #1976d2;
    }

    .items-list {
      margin-top: 16px;
    }

    .item {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }

    .item-name {
      flex: 1;
      margin-right: 16px;
    }

    .item-details {
      color: #666;
      white-space: nowrap;
    }

    @media (max-width: 599px) {
      .history-container {
        padding: 16px;
      }
    }
  `]
})
export class HistoryComponent implements OnInit {
  receipts: Receipt[] = [];

  constructor(private mockService: MockService) {}

  ngOnInit() {
    this.mockService.getMockReceipts().subscribe(
      receipts => this.receipts = receipts
    );
  }
}
