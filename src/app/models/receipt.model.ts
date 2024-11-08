export interface Item {
    name: string;
    quantity: string | null; // Quantity can be a string or null
    price: string;           // Price of the item
    category: string;        // Category of the item
}

export interface Receipt {
    storeName: string;       // Name of the store
    date: string;            // Date of purchase
    totalSum: string;        // Total sum of the receipt
    items: Item[];           // Array of items in the receipt
}

