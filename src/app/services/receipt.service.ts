import {Injectable} from '@angular/core';
import {addDoc, collection, Firestore, getDocs, query, where} from "@angular/fire/firestore";
import {Auth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor(private firestore: Firestore, private auth: Auth) { }

  async saveReceipt(receipt: any) {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const receiptWithUser = { ...receipt, userId: user.uid };
        const receiptCollection = collection(this.firestore, 'receipts');
        await addDoc(receiptCollection, receiptWithUser);
        console.log("Receipt saved successfully");
      } else {
        console.error("User not logged in");
      }
    } catch (error) {
      console.error("Error saving receipt: ", error);
    }
  }

  async getUserReceipts() {
    const user = this.auth.currentUser;
    if (user) {
      const receiptCollection = collection(this.firestore, 'receipts');
      const userReceiptsQuery = query(receiptCollection, where("userId", "==", user.uid));
      const snapshot = await getDocs(userReceiptsQuery);

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      console.error("User not logged in");
      return [];
    }
  }

  async getLoggedInUser() {
    return this.auth.currentUser;
  }
}
