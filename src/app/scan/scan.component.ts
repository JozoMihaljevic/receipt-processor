import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockService } from '../services/mock.service';
import { Receipt } from '../models/receipt.model';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="scan-container">
      <h1>Scan Receipt</h1>

      <mat-card class="upload-card">
        <mat-card-content>
          <div class="upload-area"
               [class.drag-over]="isDragging"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)">
            <mat-icon>cloud_upload</mat-icon>
            <h3>Drag and drop your receipt here</h3>
            <p>or</p>
            <button mat-raised-button color="primary" (click)="fileInput.click()">
              Choose File
            </button>
            <input #fileInput type="file"
                   (change)="onFileSelected($event)"
                   accept="image/*"
                   style="display: none">
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="isProcessing" class="processing-container">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Processing your receipt...</p>
      </div>

      <mat-card *ngIf="receipt" class="result-card">
        <mat-card-header>
          <mat-card-title>Receipt Details</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="receipt-details">
            <p><strong>Store:</strong> {{ receipt.storeName }}</p>
            <p><strong>Date:</strong> {{ receipt.date }}</p>
            <p><strong>Total:</strong> {{ receipt.totalSum }}€</p>

            <h3>Items</h3>
            <div class="items-list">
              <div *ngFor="let item of receipt.items" class="item">
                <span>{{ item.name }}</span>
                <span>{{ item.quantity }}</span>
                <span>{{ item.price }}€</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .scan-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .upload-card {
      margin: 24px 0;
    }

    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-area.drag-over {
      background-color: rgba(0, 0, 0, 0.05);
      border-color: #1976d2;
    }

    .upload-area mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
      color: #666;
    }

    .processing-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 24px 0;
    }

    .result-card {
      margin-top: 24px;
    }

    .receipt-details {
      margin-top: 16px;
    }

    .items-list {
      margin-top: 16px;
    }

    .item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    @media (max-width: 599px) {
      .scan-container {
        padding: 16px;
      }

      .upload-area {
        padding: 24px;
      }
    }
  `]
})
export class ScanComponent {
  isDragging = false;
  isProcessing = false;
  receipt: Receipt | null = null;

  constructor(private mockService: MockService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  private processFile(file: File) {
    this.isProcessing = true;
    this.receipt = null;

    this.mockService.simulateImageRecognition(file).subscribe(text => {
      this.mockService.simulateAIProcessing(text).subscribe(
        receipt => {
          this.receipt = receipt;
          this.isProcessing = false;
        },
        error => {
          console.error('Error processing receipt:', error);
          this.isProcessing = false;
        }
      );
    });
  }
}
