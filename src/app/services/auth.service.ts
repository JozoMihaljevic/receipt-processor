import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider} from 'firebase/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private afAuth: AngularFireAuth) {}

    // Google Sign-In
    loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return this.afAuth.signInWithPopup(provider);
    }

    // Logout
    logout() {
        return this.afAuth.signOut();
    }

    // Check Auth State
    isLoggedIn() {
        return this.afAuth.authState;
    }
}
