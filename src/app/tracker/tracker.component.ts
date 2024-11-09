import {Component} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {GoogleVisionService} from "../services/google-vision.service";
import {HttpClientModule} from "@angular/common/http";
import {Item, Receipt} from "../models/receipt.model";
import {ReceiptService} from "../services/receipt.service";

@Component({
    selector: 'app-tracker',
    standalone: true,
    imports: [
        NgIf,
        CommonModule,
        HttpClientModule
    ],
    templateUrl: './tracker.component.html',
    styleUrls: ['./tracker.component.css']
})
export class TrackerComponent {
    receipt!: Receipt | null;
    isLoading: boolean = false;
    userReceipts: any[] = [];
    user: any;

    constructor(private googleVisionService: GoogleVisionService, private receiptService: ReceiptService) {
    }

    getGroupedItems(): Record<string, Item[]> | undefined {
        return this.receipt?.items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = []; // Initialize array if category doesn't exist
            }
            acc[item.category].push(item); // Add item to the category array
            return acc;
        }, {} as Record<string, Item[]>);
    }

    onFileSelectedForTextExtraction(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64Image = reader.result?.toString().split(',')[1];
          if (base64Image) {
            this.isLoading = true;
            this.googleVisionService.extractTextFromImage(base64Image).subscribe(response => {
              console.log('Extracted Text:', response);
              this.processExtractedTextWithGemini(response);
            });
          }
        };
      }
    }

    processExtractedTextWithGemini(visionResponse: any) {
      const extractedText = visionResponse.responses[0].fullTextAnnotation?.text || '';
      console.log('Text to process:', extractedText);
      this.sendTextToGeminiForReceiptProcessing(extractedText);
    }

    sendTextToGeminiForReceiptProcessing(extractedText: string) {
      this.googleVisionService.processExtractedText(extractedText)
        .then((receipt: Receipt) => {
          this.isLoading = false;
          this.receipt = receipt;
          console.log(this.receipt); // Log the receipt object to check its structure
        })
        .catch(error => {
          this.isLoading = false;
          console.log('Error:', error);
        });
    }

    confirmAndSaveReceipt() {
      // Save the receipt only after user verification
      if (this.receipt) {
        this.receiptService.saveReceipt(this.receipt)
          .then(() => {
            console.log('Receipt saved successfully');
            // You may also add code here to notify the user or navigate away
          })
          .catch(error => {
            console.error('Error saving receipt:', error);
          });
      }
    }

    async loadReceipts() {
      this.userReceipts = await this.receiptService.getUserReceipts();
      console.log(this.userReceipts);
    }

    async showLoggedInUser() {
        this.user = await this.receiptService.getLoggedInUser();
        console.log(this.user);
    }
}
