import {Component} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {GoogleVisionService} from "../services/google-vision.service";
import {HttpClientModule} from "@angular/common/http";
import {Item, Receipt} from "../models/receipt.model";

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

    constructor(private googleVisionService: GoogleVisionService) {
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

    onFileSelectedGoogleVision(event: any) {
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
                        this.processWithGemini(response);
                    });
                }
            };
        }
    }

    processWithGemini(visionResult: any) {
        const extractedText = visionResult.responses[0].fullTextAnnotation?.text || '';
        console.log('Text to process:', extractedText);
        this.testGemini(extractedText);
    }

    testGemini(extractedText: string) {
        this.googleVisionService.testGeminiPro(extractedText)
            .then((receipt: Receipt) => {
                this.isLoading = false;
                this.receipt = receipt; // Assign the parsed JSON to this.receipt
                console.log(this.receipt); // Log the receipt object to check its structure
            })
            .catch(error => {
                this.isLoading = false;
                console.log('Error:', error)
            });
    }
}
