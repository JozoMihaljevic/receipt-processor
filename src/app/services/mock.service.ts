import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Receipt } from '../models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  private mockReceipts: Receipt[] = [
    {
      storeName: "Sample Supermarket",
      date: "2024-02-20",
      totalSum: "45.99",
      items: [
        {
          name: "Organic Bananas",
          quantity: "1 kg",
          price: "3.99",
          category: "fruits and vegetables"
        },
        {
          name: "Whole Milk",
          quantity: "1 L",
          price: "2.49",
          category: "dairy"
        },
        {
          name: "Chocolate Bar",
          quantity: "100g",
          price: "1.99",
          category: "sweets and snacks"
        }
      ]
    }
  ];

  // Simulate image recognition delay
  simulateImageRecognition(imageFile: File): Observable<string> {
    return of(`Simulated OCR text from ${imageFile.name}`).pipe(delay(1500));
  }

  // Simulate AI processing delay
  simulateAIProcessing(text: string): Observable<Receipt> {
    return of(this.mockReceipts[0]).pipe(delay(2000));
  }

  // Get mock receipts
  getMockReceipts(): Observable<Receipt[]> {
    return of(this.mockReceipts).pipe(delay(1000));
  }
}
