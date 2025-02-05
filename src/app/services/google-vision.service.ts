import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SchemaType} from "@google/generative-ai";
import {environment} from "../../environments/environment";
import {Receipt} from "../models/receipt.model";

@Injectable({
    providedIn: 'root'
})
export class GoogleVisionService {
    private apiKey = 'y4apikey';
    private visionEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`;
    schema = {
        description: "Representation of a receipt including items with category information",
        type: SchemaType.OBJECT,
        properties: {
            storeName: {
                type: SchemaType.STRING,
                description: "The name of the store where the receipt is from",
                nullable: false,
            },
            date: {
                type: SchemaType.STRING,
                description: "The date of purchase",
                nullable: false,
            },
            totalSum: {
                type: SchemaType.STRING,
                description: "Total sum of the receipt",
                nullable: false,
            },
            items: {
                type: SchemaType.ARRAY,
                description: "List of items in the receipt, including categories",
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        name: {
                            type: SchemaType.STRING,
                            description: "Name of the item",
                            nullable: false,
                        },
                        quantity: {
                            type: SchemaType.STRING,
                            description: "Quantity of the item, can be null",
                            nullable: true,
                        },
                        price: {
                            type: SchemaType.STRING,
                            description: "Price of the item",
                            nullable: false,
                        },
                        category: {
                            type: SchemaType.STRING,
                            description: "The category to which this item belongs",
                            nullable: false,
                        },
                    },
                    required: ["name", "price", "category"],
                },
            },
        },
        required: ["storeName", "date", "totalSum", "items"],
    };

    genAI = new GoogleGenerativeAI(environment.API_KEY);
    generationConfig = {
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            }
        ],
        temperature: 0.5,  // Lower for more deterministic responses
        top_p: 0.9,        // Reduce to focus on more probable outcomes
        top_k: 20,        // Limit choices to the top 20 options
        maxOutputTokens: 300, // Increase if more detailed responses are needed
        responseMimeType: "application/json",
        responseSchema: this.schema,
    };
    model = this.genAI.getGenerativeModel({
        model: 'gemini-pro', // or 'gemini-pro-vision'
        ...this.generationConfig,
    });

    constructor(private http: HttpClient) { }

    extractTextFromImage(base64Image: string): Observable<any> {
        const request = {
            requests: [
                {
                    image: {
                        content: base64Image // Pass base64 encoded image
                    },
                    features: [
                        {
                            type: 'TEXT_DETECTION' // Google Vision API feature to detect text
                        }
                    ]
                }
            ]
        };

        return this.http.post(this.visionEndpoint, request);
    }

    async processExtractedText(extractedText: string): Promise<Receipt> {
        try {
            // Update the prompt to include strict JSON format instructions
            const prompt = `You are an expert that helps me while shopping in Germany. I want to get a JSON object with storeName, date, totalSum and items properties. The categories are predefined "fruits and vegetables", "sweets and snacks", "dairy", "meat", "hygiene", "beverages", and "uncategorized" and categorize items to respective category. If an item doesn't match any predefined category, place it in "uncategorized".\n Dont make up categories. Process this receipt data into a JSON object ${extractedText}.\n\n`;

            // Generate content with the model
            const result = await this.model.generateContent(prompt);

            // Get response text
            let responseText = result.response.text();

            // Clean up the response if necessary
            responseText = responseText.replace(/``` JSON|```json|```JSON|``` json|```/g, '').trim();

            // Parse the text as JSON
            const jsonResponse: Receipt = JSON.parse(responseText);

            // Log the parsed JSON object
            console.log(jsonResponse);
            return jsonResponse;
        } catch (error) {
            console.error('Error generating JSON response:', error);
            throw error;
        }
    }
}
